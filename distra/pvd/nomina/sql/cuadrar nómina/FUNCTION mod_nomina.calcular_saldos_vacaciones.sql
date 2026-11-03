-- Función auxiliar para calcular saldos
CREATE OR REPLACE FUNCTION mod_nomina.calcular_saldos_vacaciones(
    p_row_num numeric,
    p_tipooperacion numeric,
    p_tipoajuste numeric,
    p_ajustetiempo numeric,
    p_ajusteimporte numeric,
    p_tiempo_inicial numeric,
    p_importe_inicial numeric,
    p_vac_acum_d numeric,
    p_vac_acum_i numeric,
    p_anterior_saldo_tiempo numeric,
    p_anterior_saldo_importe numeric,
    INOUT p_saldo_tiempo numeric,
    INOUT p_saldo_importe numeric
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_row_num = 1 THEN
        -- Primer registro del histórico
        IF p_tipooperacion = 1 THEN
            -- Acumulación (+)
            p_saldo_tiempo := p_tiempo_inicial + p_vac_acum_d;
            p_saldo_importe := p_importe_inicial + p_vac_acum_i;
        ELSE
            -- Liquidación (-)
            p_saldo_tiempo := p_tiempo_inicial - p_vac_acum_d;
            p_saldo_importe := p_importe_inicial - p_vac_acum_i;
        END IF;
    ELSE
        -- Registros subsiguientes
        IF p_tipooperacion = 1 THEN
            -- Acumulación (+)
            p_saldo_tiempo := p_anterior_saldo_tiempo + p_vac_acum_d;
            p_saldo_importe := p_anterior_saldo_importe + p_vac_acum_i;
        ELSE
            -- Liquidación (-)
            p_saldo_tiempo := p_anterior_saldo_tiempo - p_vac_acum_d;
            p_saldo_importe := p_anterior_saldo_importe - p_vac_acum_i;
        END IF;
    END IF;

    -- Aplicar ajustes si existen
    IF p_tipoajuste IS NOT NULL THEN
        IF p_tipoajuste = 1 THEN
            -- Suma (+)
            p_saldo_tiempo := p_saldo_tiempo + p_ajustetiempo;
            p_saldo_importe := p_saldo_importe + p_ajusteimporte;
        ELSE
            -- Resta (-)
            p_saldo_tiempo := p_saldo_tiempo - p_ajustetiempo;
            p_saldo_importe := p_saldo_importe - p_ajusteimporte;
        END IF;
    END IF;
END;
$$;
