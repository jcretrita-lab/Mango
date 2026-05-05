export interface EnvironmentConfiguration {
  readonly port: number;
  readonly corsOrigins: readonly string[];
  readonly jwtSecret: string;
  readonly jwtExpiresIn: string;
}

export const DEFAULT_PORT = 3000;
export const PORT_CONFIG_KEY = 'port' as const;
export const PORT_ENV_KEY = 'PORT' as const;
export const CORS_ORIGINS_CONFIG_KEY = 'corsOrigins' as const;
export const JWT_SECRET_CONFIG_KEY = 'jwtSecret' as const;
export const JWT_EXPIRES_IN_CONFIG_KEY = 'jwtExpiresIn' as const;

function resolvePort(value: string | undefined): number {
  const parsedPort = Number.parseInt(value ?? '', 10);

  if (Number.isNaN(parsedPort) || parsedPort <= 0) {
    return DEFAULT_PORT;
  }

  return parsedPort;
}

function resolveCorsOrigins(value: string | undefined): readonly string[] {
  if (!value?.trim()) {
    return ['http://localhost:5173'];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production.');
  }

  return 'diwa-hris-phase1-dev-secret-change-before-prod';
}

const configuration = (): EnvironmentConfiguration => ({
  port: resolvePort(process.env[PORT_ENV_KEY]),
  corsOrigins: resolveCorsOrigins(process.env.CORS_ORIGINS),
  jwtSecret: resolveJwtSecret(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN?.trim() || '8h',
});

export default configuration;
