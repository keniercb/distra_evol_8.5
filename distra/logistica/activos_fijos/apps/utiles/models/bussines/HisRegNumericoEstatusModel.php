<?php

/**
 *  Jorge Luis Cuellar Mondeja 06/11/2015
 */
class HisRegNumericoEstatusModel extends BaseModel
{

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @param $idDocumento
     */
    public function guardarHistorialRegNumEstatus($idDocumento = false, $fechainicio = false)
    {
        $idestructura = $this->global->Estructura->idestructura;
        // Se buscan los movimientos de registros numéricos del documento
        $query = new Doctrine_Query();
        $query
            ->from('DatMovRegnumerico movrn')
            ->innerJoin('movrn.DatMovimientos mov')
            ->innerJoin('mov.DatDocumento doc')
            ->innerJoin('movrn.DatMovRegnumericoActivo movrna')
            ->innerJoin('movrna.NomEstatustecnico net');

            if(!$idDocumento){
                $query
                    ->innerJoin('mov.DatProductoLogistica prod')
                    ->innerJoin('prod.NomIndicador i')
                    ->innerJoin('i.NomIndicadorhoja ih')
                    
                    ->innerJoin('doc.DatDocumentoprim prim')
                    ->innerJoin('prim.DatEstructurasubsist estsub')
                    ->where('estsub.idestructuracomun = ? and estsub.idsubsistema = ? and ih.isuh <> ?', array($idestructura, 11, 1));
            } else {
                $query->where('doc.iddocumento = ?', array($idDocumento));
            }

            $arrMovRNA = $query->fetchArray();

        // Se busca para cada movimiento el historial que tiene
        $colectionHisRNEstatus = new Doctrine_Collection('HisRegNumericoEstatus');

        foreach ($arrMovRNA as $movpos => $movRNA) {
            $queryHis = new Doctrine_Query();

            $ultimoHistorial = $queryHis->select()
                ->from('HisRegNumericoEstatus his')
                ->where('his.idregnumerico = ?', array($movRNA['idregnumerico']))
                ->orderBy('his.idregnumericoestatus DESC')
                ->limit(1)
                ->execute();

            if ($ultimoHistorial->count() > 0) {

                // Si el estado del historial es distinto al del movimiento hago lo siguiente:
                if ($ultimoHistorial[0]->idestatustecnico != $movRNA['DatMovRegnumericoActivo']['idestatustecnico']) {
                    /**
                     * Modifico el viejo
                     * Le pongo a la fecha fin del historial la fecha del documento en que se realizo el movimiento
                     * Le pongo al historial la cantidad de dias de diferencia entre la fecha inicio y la fin
                     */
                    $ultimoHistorial[0]->fechafin = $movRNA['DatMovimientos']['DatDocumento']['fechacontable'];
                    $ultimoHistorial[0]->cantdias = $this->calculaDiasEntreFechas(
                        $ultimoHistorial[0]->fechainicio, $ultimoHistorial[0]->fechafin
                    );
                    $ultimoHistorial->save();
                    /**
                     * Inserto el nuevo
                     * Creo un historial nuevo con fecha inicio igual a la fecha del documento
                     */
                    $nuevoHistorial = new HisRegNumericoEstatus();
                    $nuevoHistorial->idregnumerico = $movRNA['idregnumerico'];
                    $nuevoHistorial->idestatustecnico = $movRNA['DatMovRegnumericoActivo']['idestatustecnico'];
                    $nuevoHistorial->fechainicio = $movRNA['DatMovimientos']['DatDocumento']['fechacontable'];
                    $nuevoHistorial->deprecia = $movRNA['DatMovRegnumericoActivo']['NomEstatustecnico']['deprecia'];
                    $colectionHisRNEstatus->add($nuevoHistorial);
                }
            } else {
                /**
                 * Inserto el nuevo
                 * Creo un historial nuevo con fecha inicio igual a la fecha del documento
                 *
                 * En caso de que la fecha por la que se deprecian los activos sea anterior a la fecha del
                 * documento y no tenga depreciacion acumulada la fecha inicial que se pone en el historial
                 * es la fecha por la que se deprecia (fecha explotacion inicio/ fecha adquisicion)
                 *
                 * En caso de que la fecha por la que se deprecian los activos sea posterior a la fecha del
                 * documento, se pone en la fecha fin la fecha por la que se deprecia en el sistema.
                 */
                $confAft = new ConfiguracionActivosService();
                $conf = $confAft->getConfiguracionPG($idestructura);

                if(!$fechainicio) {
                    $campofecha = ($conf[0]['explotacionadquisicion'] == 1) ? 'fechaexpini' : 'fechaadq';
                    if ($movRNA['DatMovRegnumericoActivo'][$campofecha] != null &&
                        $movRNA['DatMovRegnumericoActivo'][$campofecha] <
                        $movRNA['DatMovimientos']['DatDocumento']['fechacontable'] &&
                        $movRNA['DatMovimientos']['DatDocumento']['fechacontable'] != null &&
                        $movRNA['DatMovRegnumericoActivo']['depreciacionacumulada'] == 0
                    ) {
                        $fechainicio = $movRNA['DatMovRegnumericoActivo'][$campofecha];
                    } else {
                        $fechainicio = $movRNA['DatMovimientos']['DatDocumento']['fechacontable'];
                    }
                }

                $nuevoHistorial = new HisRegNumericoEstatus();
                $nuevoHistorial->idregnumerico = $movRNA['idregnumerico'];
                $nuevoHistorial->idestatustecnico = $movRNA['DatMovRegnumericoActivo']['idestatustecnico'];
                $nuevoHistorial->fechainicio = $fechainicio;
                $nuevoHistorial->deprecia = $movRNA['DatMovRegnumericoActivo']['NomEstatustecnico']['deprecia'];               
                $colectionHisRNEstatus->add($nuevoHistorial);
            }
        }
        $colectionHisRNEstatus->save();
    }

    public function crearHistorialInicial($idestructura) {
        $sql = "
            INSERT INTO 
                mod_logactivofijotangible.his_regnumericoestatus
            (
                idregnumerico,
                idestatustecnico,
                fechainicio,
                deprecia
            ) 
            SELECT mrn.idregnumerico, mrna.idestatustecnico, d.fechacontable, et.deprecia
            FROM mod_logactivofijotangible.dat_movregnumerico mrn
            INNER JOIN mod_logistica.dat_movimiento m on m.idmovimiento = mrn.idmovimiento
            INNER JOIN mod_logistica.dat_producto p on p.idproducto = m.idproducto
            INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
            INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
            INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
            INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = mrn.idmovregnumerico
            INNER JOIN mod_logactivofijotangible.nom_estatustecnico et on et.idestatustecnico = mrna.idestatustecnico
            INNER JOIN mod_datosmaestros.dat_documentoprim prim on prim.iddoc = d.iddoc
            INNER JOIN mod_datosmaestros.dat_estructurasubsist estsub on estsub.idestructurasubsist = prim.idestructurasubsist
            WHERE estsub.idestructuracomun = $idestructura AND estsub.idsubsistema = 11 AND ih.isuh <> 1
        ";
        
        $conn = Zend_Registry::get('conexion');
        $conn->execute($sql);

        // Se buscan los movimientos de registros numéricos del documento
        /*$query = new Doctrine_Query();
        $arrMovRNA = $query
            ->from('DatMovRegnumerico movrn')
            ->innerJoin('movrn.DatMovimientos mov')
            ->innerJoin('mov.DatProductoLogistica prod')
            ->innerJoin('prod.NomIndicador i')
            ->innerJoin('i.NomIndicadorhoja ih')
            ->innerJoin('mov.DatDocumento doc')
            ->innerJoin('movrn.DatMovRegnumericoActivo movrna')
            ->innerJoin('movrna.NomEstatustecnico net')
            ->innerJoin('doc.DatDocumentoprim prim')
            ->innerJoin('prim.DatEstructurasubsist estsub')
            ->where('estsub.idestructuracomun = ? and estsub.idsubsistema = ? and ih.isuh <> ?', array($idestructura, 11, 1))
            ->fetchArray();

        // Se busca para cada movimiento el historial que tiene
        $colectionHisRNEstatus = new Doctrine_Collection('HisRegNumericoEstatus');
        $confAft = new ConfiguracionActivosService();
        $conf = $confAft->getConfiguracionPG($idestructura);

        foreach ($arrMovRNA as $movpos => $movRNA) {
            
            $nuevoHistorial = new HisRegNumericoEstatus();
            $nuevoHistorial->idregnumerico = $movRNA['idregnumerico'];
            $nuevoHistorial->idestatustecnico = $movRNA['DatMovRegnumericoActivo']['idestatustecnico'];
            $nuevoHistorial->fechainicio = $movRNA['DatMovimientos']['DatDocumento']['fechacontable'];
            $nuevoHistorial->deprecia = $movRNA['DatMovRegnumericoActivo']['NomEstatustecnico']['deprecia'];               
            $colectionHisRNEstatus->add($nuevoHistorial);
        }
        $colectionHisRNEstatus->save();*/
    }

    /**
     * @param $fechaIni
     * @param $fechaFin
     *
     * @return int
     */
    private function calculaDiasEntreFechas($fechaIni, $fechaFin)
    {
        $fechaInicial = explode('/', $fechaIni);
        $diaIni = $fechaInicial[0];
        $mesIni = $fechaInicial[1];
        $annoIni = $fechaInicial[2];

        $fechaFinal = explode('/', $fechaFin);
        $diaFin = $fechaFinal[0];
        $mesFin = $fechaFinal[1];
        $annoFin = $fechaFinal[2];

        return ComunAFTModel::getInstance()->getCantDias($diaIni, $mesIni, $annoIni, $diaFin, $mesFin, $annoFin);
    }

    /**
     * Devuelve un arreglo asociativo que poseé en la columna 'cantDiasDepMov' la cantidad 
     * de días que han transcurrido
     * entre la fecha inicio y fecha fin, y que deben depreciar según el estatus técnico adquirido por el
     * registro numérico parametrizado. en la segunda columna 'fechaIniMovSinDep' muestra la fecha inicial
     * (en caso de tener) del último estado que deprecia que él mismo poseé y que no se ha 
     * incluido en la sumatoria de
     * días a depreciar de la primera columna asociativa de la respuesta.
     *
     * @param      $idRegNumerico
     * @param bool $fechaInicio
     * @param      $fechaFin
     *
     * @return array
     */
    public function getCantDiasDepreciar($idRegNumerico, $fechaInicio = false, $fechaFin)
    {
        $query = new Doctrine_Query();
        $query->select('SUM(his.cantdias) AS cantidad')
            ->from('HisRegNumericoEstatus his')
            ->addWhere('his.fechafin <= ?', array($fechaFin))
            ->addWhere('his.idregnumerico = ? AND his.deprecia = 1', array($idRegNumerico));

        if ($fechaInicio) {
            $query->addWhere('his.fechainicio >= ?', array($fechaInicio));
        }

        $cantPeriodos = $query->fetchOne()->cantidad;
        if(!$cantPeriodos){
            $cantPeriodos = 0;
        }


        $query = new Doctrine_Query();
        $query->select('his.fechainicio')
            ->from(
                'HisRegNumericoEstatus his'
            )->addWhere('his.idregnumerico = ? AND his.fechafin IS NULL', array($idRegNumerico));

        $fecha = $query->fetchOne()->fechainicio;

        return array(
            'cantDiasDepMov' => $cantPeriodos,
            'fechaIniMovSinDep' => $fecha
        );
    }

    public function eliminarHistorial($idregnumerico){

        /*if(!is_array($idregnumerico)){
            $idregnumerico = array($idregnumerico);
        }
        $query = new Doctrine_Query();
        $query->delete()->from('HisRegNumericoEstatus hrne')->whereIn('hrne.idregnumerico', $idregnumerico)->execute();*/

        if(!$idregnumerico){
            throw new Exception('Falta el idregnumerico');
        }
        if(!is_array($idregnumerico)){
            $idregnumerico = array($idregnumerico);
        }
        $idregistros = implode(',',$idregnumerico);
        $sql = "DELETE FROM mod_logactivofijotangible.his_regnumericoestatus WHERE idregnumericoestatus IN ($idregnumerico);";
        $conn->execute($sql);    
    }

}
