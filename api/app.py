import os
from datetime import datetime, timezone
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from sqlalchemy import Text, DateTime, Integer
from sqlalchemy.orm import declarative_base, mapped_column, Mapped, sessionmaker
from sqlalchemy import create_engine, select

# ---------- Configuração DB ----------
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://tcc:tcc@db:5432/tcc")
engine = create_engine(DATABASE_URL, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
Base = declarative_base()

class Entry(Base):
    __tablename__ = "entries"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    situacao: Mapped[str] = mapped_column(Text, nullable=False)
    sentimentos: Mapped[str] = mapped_column(Text, nullable=False)
    pensamentos: Mapped[str] = mapped_column(Text, nullable=False)
    fatos: Mapped[str] = mapped_column(Text, nullable=False)
    resolucao: Mapped[str] = mapped_column(Text, nullable=True)
    observacoes: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)

Base.metadata.create_all(bind=engine)

# ---------- Schemas ----------
class EntryIn(BaseModel):
    situacao: str = Field(..., min_length=1)
    sentimentos: str = Field(..., min_length=1)
    pensamentos: str = Field(..., min_length=1)
    fatos: str = Field(..., min_length=1)
    resolucao: str | None = None
    observacoes: str | None = None

class EntryOut(EntryIn):
    id: int
    created_at: datetime

# ---------- App ----------
app = FastAPI(title="Diário TCC API", version="1.0.0")

# CORS liberado (como servimos o site pela própria API, isto é só por segurança)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir estáticos (index.html)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def root():
    # carrega o site
    return FileResponse("static/index.html")

# ---------- Endpoints ----------
@app.post("/api/entries", response_model=EntryOut)
def create_entry(payload: EntryIn):
    with SessionLocal() as session:
        e = Entry(
            situacao=payload.situacao.strip(),
            sentimentos=payload.sentimentos.strip(),
            pensamentos=payload.pensamentos.strip(),
            fatos=payload.fatos.strip(),
            resolucao=(payload.resolucao or "").strip(),
            observacoes=(payload.observacoes or "").strip(),
        )
        session.add(e)
        session.commit()
        session.refresh(e)
        return EntryOut(
            id=e.id,
            situacao=e.situacao,
            sentimentos=e.sentimentos,
            pensamentos=e.pensamentos,
            fatos=e.fatos,
            resolucao=e.resolucao,
            observacoes=e.observacoes,
            created_at=e.created_at,
        )

@app.get("/api/entries", response_model=List[EntryOut])
def list_entries():
    with SessionLocal() as session:
        result = session.execute(select(Entry).order_by(Entry.created_at.desc()))
        records = [r[0] for r in result.all()]
        return [
            EntryOut(
                id=e.id,
                situacao=e.situacao,
                sentimentos=e.sentimentos,
                pensamentos=e.pensamentos,
                fatos=e.fatos,
                resolucao=e.resolucao,
                observacoes=e.observacoes,
                created_at=e.created_at,
            )
            for e in records
        ]
