export interface EnvironmentConfiguration {
  readonly nodeEnv: string;
  readonly port: number;
  readonly corsOrigins: readonly string[];
  readonly jwtSecret: string;
  readonly jwtExpiresIn: string;
  readonly swaggerEnabled: boolean;
}

export const DEFAULT_PORT = 3000;
export const RUNTIME_ENV_CONFIG_KEY = 'nodeEnv' as const;
export const PORT_CONFIG_KEY = 'port' as const;
export const PORT_ENV_KEY = 'PORT' as const;
export const CORS_ORIGINS_CONFIG_KEY = 'corsOrigins' as const;
export const JWT_SECRET_CONFIG_KEY = 'jwtSecret' as const;
export const JWT_EXPIRES_IN_CONFIG_KEY = 'jwtExpiresIn' as const;
export const SWAGGER_ENABLED_CONFIG_KEY = 'swaggerEnabled' as const;

/**
 * Converts PORT from the environment into a valid server port consumed by app.bootstrap.ts.
 */
function resolvePort(value: string | undefined): number {
  const parsedPort = Number.parseInt(value ?? '', 10);

  if (Number.isNaN(parsedPort) || parsedPort <= 0) {
    return DEFAULT_PORT;
  }

  return parsedPort;
}

/**
 * Parses CORS_ORIGINS into the allow-list used by configureApp() when enabling browser API calls.
 */
function resolveCorsOrigins(value: string | undefined): readonly string[] {
  if (!value?.trim()) {
    return ['http://localhost:5173'];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function resolveNodeEnv(): string {
  return process.env.NODE_ENV?.trim() || 'development';
}

function assertDatabaseUrl(nodeEnv: string): void {
  if (nodeEnv === 'test') {
    return;
  }

  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error('DATABASE_URL must be set.');
  }
}

/**
 * Resolves the JWT signing secret for AuthModule and refuses to start production without an explicit secret.
 */
function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  const nodeEnv = resolveNodeEnv();

  if (secret) {
    if (nodeEnv === 'production' && secret.length < 32) {
      throw new Error(
        'JWT_SECRET must be at least 32 characters in production.',
      );
    }

    return secret;
  }

  if (nodeEnv !== 'development' && nodeEnv !== 'test') {
    throw new Error('JWT_SECRET must be set in production.');
  }

  return 'diwa-hris-phase1-dev-secret-change-before-prod';
}

function resolveSwaggerEnabled(nodeEnv: string): boolean {
  const explicitValue = process.env.SWAGGER_ENABLED?.trim();

  if (explicitValue) {
    return explicitValue.toLowerCase() === 'true';
  }

  return nodeEnv === 'development' || nodeEnv === 'test';
}

/**
 * Builds the typed configuration object loaded globally by ConfigModule in AppModule.
 */
const configuration = (): EnvironmentConfiguration => {
  const nodeEnv = resolveNodeEnv();
  assertDatabaseUrl(nodeEnv);

  return {
    nodeEnv,
    port: resolvePort(process.env[PORT_ENV_KEY]),
    corsOrigins: resolveCorsOrigins(process.env.CORS_ORIGINS),
    jwtSecret: resolveJwtSecret(),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN?.trim() || '8h',
    swaggerEnabled: resolveSwaggerEnabled(nodeEnv),
  };
};

export default configuration;
