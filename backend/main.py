import asyncio
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import jobs, watchlist, tracker, companies
from services.scheduler import refresh_all_companies

load_dotenv()


async def _refresh_loop():
    while True:
        try:
            await refresh_all_companies()
        except Exception as e:
            print(f"[scheduler] Error: {e}")
        await asyncio.sleep(6 * 3600)


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(_refresh_loop())
    yield
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass


app = FastAPI(title="JobsTrack API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs.router, prefix="/api")
app.include_router(watchlist.router, prefix="/api")
app.include_router(tracker.router, prefix="/api")
app.include_router(companies.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}
