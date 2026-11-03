<?php

/**
 * Componente para gestionar las fechas de los subsistemas.
 *
 * @package    Configuración
 * @subpackage Fecha/Models/Bussines
 * @copyright  XETID
 * @version    1.0
 */
class OperacionesFechas
{
    /**
     * Devuelve la fecha siguiente
     *
     * @param object $fecha Objeto fecha
     * @param int    $dias  Cantidad de dias
     *
     * @return object Retorna un objeto de tipo fecha dado una fecha y la cantidad de dias
     */
    public function nextDate($fecha, $dias)
    {
        list($diaActual, $mesActual, $anioActual) = explode('/', $fecha);
        $mesProx = $mesActual;
        $anioProx = $anioActual;
        $diaProx = $diaActual + $dias;

        $diasMes = cal_days_in_month(CAL_GREGORIAN, $mesActual, $anioActual);
        if ($diaProx > $diasMes) {
            $diaProx = $dias - ($diasMes - $diaActual);
            $mesProx = $mesActual + 1;
            if ($mesProx > 12) {
                $mesProx = "01";
                $anioProx = $anioActual + 1;
            }
            $diasProxMes = cal_days_in_month(CAL_GREGORIAN, $mesProx, $anioProx);
            if ($diaProx > $diasProxMes) {
                $dias = $diaProx - $diasProxMes;
                $diaProx = (strlen($diaProx) == 1) ? "0" . $diaProx : $diaProx;
                $mesProx = (strlen($mesProx) == 1) ? "0" . $mesProx : $mesProx;
                return self::nextDate($anioProx . "/" . $mesProx . "/" . $diasProxMes, $dias);
            }
        }
        $data = self::deleteCiclomaticComplex($diaProx, $mesProx);
        $diaProx = $data[0];
        $mesProx = $data[1];
        return $diaProx . "/" . $mesProx . "/" . $anioProx;
    }

    /**
     * Eliminar complejidad ciclomatica
     *
     * @param int $diaProx Proximo dia
     * @param int $mesProx Proximo mes
     *
     * @return array Retorna un array
     */
    public function deleteCiclomaticComplex($diaProx, $mesProx)
    {
        $diaProx = (strlen($diaProx) == 1) ? "0" . $diaProx : $diaProx;
        $mesProx = (strlen($mesProx) == 1) ? "0" . $mesProx : $mesProx;
        $out = array();
        $out[0] = $diaProx;
        $out[1] = $mesProx;
        return $out;
    }

    /**
     * Devuelve la diferencia de dias entre 2 fechas
     *
     * @param object $fecha1 Objeto fecha
     * @param object $fecha2 Objeto fecha
     *
     * @return int Retorna la cantidad de dias de diferencia entre 2 fechas
     */
    public function diferenciasfechas($fechai, $fechaf)
    {
        $fechai = self::FormatFechas($fechai);
        $fechaf = self::FormatFechas($fechaf);

        $timestampi = mktime(0, 0, 0, $fechai[1], $fechai[0], $fechai[2]);
        $timestampf = mktime(4, 12, 0, $fechaf[1], $fechaf[0], $fechaf[2]);


        $segundosdiferencia = $timestampi - $timestampf;

        $diasdiferencia = $segundosdiferencia / (60 * 60 * 24);


        $diasdiferencia = abs($diasdiferencia);


        $diasdiferencia = floor($diasdiferencia);
        return $diasdiferencia;
    }

    /**
     * Formatea una fecha
     *
     * @param object $fecha1 Objeto fecha
     *
     * @return array Retorna un arreglo con los datos de la fecha
     */
    public function FormatFechas($fecha)
    {
        list($diaActual, $mesActual, $anioActual) = explode('/', $fecha);
        return array($diaActual, $mesActual, $anioActual);
    }

    /**
     * Chequea una fecha
     *
     * @param object $date Objeto tipo fecha
     *
     * @return boolean Retorna verdadero en caso de que la fecha sea v\xE1lida falso en otro caso
     */
    static public function check_date($date)
    {
        $seperator = "[\/\-\.]";
        return preg_match(
            "#^(((0?[1-9]|1\d|2[0-8]){$seperator}(0?[1-9]|1[012])|(29|30){$seperator}
        (0?[13456789]|1[012])|31{$seperator}(0?[13578]|1[02])){$seperator}(19|[2-9]\d)\d{2}|29{
        $seperator}0?2{$seperator}
        ((19|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([2468][048]|[3579][26])00)))$#", $date
        ) == 1 ? true : false;
    }

    /**
     * Compara 2 fechas
     *
     * @param object $fecha1 Objeto fecha
     * @param object $fecha2 Objeto fecha
     *
     * @return boolean Retorna verdadero si las fechas son diferentes falso en otro caso
     */
    public function compara_fechas($fechai, $fechaf)
    {
        if (self::check_date($fechai)) {
            list($diaa, $mess, $annoo) = explode("/", $fechai);
        }
        if (self::check_date($fechaf)) {
            list($diaaa, $messs, $annooo) = explode("/", $fechaf);
        }

        $dif = mktime(0, 0, 0, $mess, $diaa, $annoo) - mktime(0, 0, 0, $messs, $diaaa, $annooo);

        if ($dif > 0) {
            return true;
        }
        return false;

    }

    /**
     * Compara 2 fechas
     *
     * @param object $fecha1 Objeto fecha
     * @param object $fecha2 Objeto fecha
     *
     * @return boolean Retorna verdadero si las fechas son iguales falso en otro caso
     */
    public function compara_fechasIguales($fechai, $fechaf)
    {
        if (self::check_date($fechai)) {
            list($diaa, $mess, $annoo) = explode("/", $fechai);
        }
        if (self::check_date($fechaf)) {
            list($diaaa, $messs, $annooo) = explode("/", $fechaf);
        }

        $dif = mktime(0, 0, 0, $mess, $diaa, $annoo) - mktime(0, 0, 0, $messs, $diaaa, $annooo);

        if ($dif == 0) {
            return true;
        }
        return false;
    }

    /**
     * Resta 2 fechas
     *
     * @param object $dFecIni Objeto fecha
     * @param object $dFecFin Objeto fecha
     *
     * @return int Retorna la cantidad de dias de diferencia entre 2 fechas
     */
    public function restaFechas($dFecIni, $dFecFin)
    {
        list($dini, $mini, $aini) = explode("/", $dFecIni);
        list($dfin, $mfin, $afin) = explode("/", $dFecFin);
        return abs(
            round((mktime(0, 0, 0, $mfin, $dfin, $afin) - mktime(0, 0, 0, $mini, $dini, $aini)) / (60 * 60 * 24))
        );
    }

}