import uvicorn

from nuitinfo.settings import settings


def main() -> None:
    """Entrypoint of the application."""
    uvicorn.run(
        "nuitinfo.web.application:get_app",
        workers=settings.workers_count,
        host=settings.host,
        port=settings.port,
        reload=settings.reload,
        log_level=settings.log_level.value.lower(),
        factory=True,
        proxy_headers=True,
        forwarded_allow_ips="*",
    )


if __name__ == "__main__":
    main()
