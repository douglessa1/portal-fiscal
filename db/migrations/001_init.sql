-- Users
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text,
  plan_id text,
  created_at timestamptz DEFAULT now()
);

-- XML documents
CREATE TABLE xml_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  original_filename text,
  s3_key text,
  cnpj_emitente text,
  cnpj_destinatario text,
  chave_nfe text,
  total_valor numeric,
  processed_at timestamptz,
  status text
);
