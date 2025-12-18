-- Histórico de simulações Simples
CREATE TABLE simples_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NULL,
  rbt12 numeric NOT NULL,
  data_calculo timestamptz DEFAULT now(),
  aliquota_nominal numeric,
  deducao numeric,
  aliquota_efetiva numeric,
  fator_r numeric,
  comparativo jsonb,
  iss_efetivo jsonb
);

-- Alerts
CREATE TABLE fiscal_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NULL,
  type text NOT NULL,
  payload jsonb,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);
