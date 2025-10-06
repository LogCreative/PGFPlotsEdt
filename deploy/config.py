"""PGFPlotsEdt Deployment Server Configuration

This module provides a Pydantic `Settings` (BaseSettings) class which
loads configuration from environment variables and a local `.env` file.
Instantiate `settings` to access typed configuration values.
"""

from typing import Union, Optional

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class PGFPlotsEdtSettings(BaseSettings):
	"""Application settings loaded from environment or .env file.

	Fields are typed and have sensible defaults that match the previous
	module-level constants.
	"""
	model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8',env_prefix='PPEDT_')

	HOST: str = Field("0.0.0.0", description="Host name for server")
	PORT: int = Field(5678, description="Port number for server")
	WORKERS: Union[int, str] = Field("auto", description="Number of workers or 'auto'")

	CACHE_SIZE: int = Field(50, description="LRU cache size")
	TIMEOUT: int = Field(30, description="Timeout for compilation in seconds")
	LENGTH_LIMIT: int = Field(8196, description="Maximum input length")

	# LLM settings
	LLM_ENABLED: bool = Field(False, description="Whether to enable LLM features")
	LLM_MODEL_NAME: Optional[str] = Field(None, examples=["gpt-4o"], description="LLM model name")
	LLM_API_BASE: Optional[str] = Field(None, examples=["https://hostname.com/v1"], description="LLM API base URL")
	LLM_API_KEY: Optional[str] = Field(None, description="LLM API key")

	# RAG settings
	RAG_ENABLED: bool = Field(False, description="Whether to enable RAG")

	# Postgres / vector DB URI
	POSTGRES_URI: Optional[str] = Field(None, examples=["postgresql://username:password@localhost:5432"], description="Postgres connection URI")

	# Embedding model settings
	EMBED_MODEL_NAME: Optional[str] = Field(None, examples=["/data/bge-small-en-v1.5"], description="Embedding model identifier or path")
	EMBED_API_BASE: Optional[str] = Field(None, examples=["http://hostname.com"], description="Embedding API base URL")

	@model_validator(mode="after")
	def _validate_enabled_features(self):
		"""Validate dependent fields when feature flags are enabled.

		- If LLM_ENABLED is True, require LLM_MODEL_NAME, LLM_API_BASE and LLM_API_KEY.
		- If RAG_ENABLED is True, require POSTGRES_URI, EMBED_MODEL_NAME and EMBED_API_BASE.
		"""
		if self.LLM_ENABLED:
			missing = [
				name for name in ("LLM_MODEL_NAME", "LLM_API_BASE", "LLM_API_KEY")
				if not getattr(self, name)
			]
			if missing:
				raise ValueError(f"LLM_ENABLED is True but missing required LLM config: {', '.join(missing)}")

		if self.RAG_ENABLED:
			missing = [
				name for name in ("POSTGRES_URI", "EMBED_MODEL_NAME", "EMBED_API_BASE")
				if not getattr(self, name)
			]
			if missing:
				raise ValueError(f"RAG_ENABLED is True but missing required RAG config: {', '.join(missing)}")

		return self


# module-level settings singleton
config = PGFPlotsEdtSettings()

