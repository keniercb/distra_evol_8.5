<?php

/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 2/23/2016
 * Time: 9:39 AM
 */
class RecuperacionesModel extends ZendExt_Model
{

    public function __construct()
    {
        parent::ZendExt_Model();
    }

    public function getOperaciones($parametros)
    {
        $activoModel = new DocumentoActivoModel();

        $datos = $activoModel->getOperaciones($parametros);
        if ($parametros['criterio']) {
            $newDatos = array();
            foreach ($datos as $dat) {
                if (stristr($dat['denominacion'], $parametros['criterio'])) {
                    $newDatos[] = $dat;
                }
            }
            return $newDatos;
        }
        return $datos;
    }

    public function getActivosDepreciados($parametros)
    {
        $depService = new DepreciacionService();
        return $depService->getRegNumDepreciadosTotalMente($parametros);

    }

    public function getMetodosDep()
    {
        $mDepEntidad = new DepreciarEntidadModel();
        return $mDepEntidad->getMetodosDepreciacion();

    }
    public function getActivosReparados($parametros)
    {
        $regService = new RegNumActivoService();
        $query= $regService->getMediosDisponibles(Array(), true);


        $_mComunAFT = ComunAFTModel::getInstance();
        $operaciones = $_mComunAFT->getDatosInterfazOperacion(false, false, 'OPER_REC_ENV_REPARAR', false);
        $cEstructura = 'Estructura';
        $globalidEstructura = ZendExt_GlobalConcept::getInstance()->$cEstructura->idestructura;
        $estructuraHelper = ServiciosEstructuraComposicionHelper::__init();
        $result = $estructuraHelper->getEstructurasHijasById(0, $globalidEstructura, false, true);
        $arrayAreas = Array();
        foreach ($result as $areas) {
            $arrayAreas[$areas['id']] = $areas['text'];
        }
        $areashijas = $this->getLlenarIDAreasHijas($result);
        $reparacion = " AND doc.idoperacion =  ".$operaciones[0]['idoperacion'];
        $query->addSelect("{$globalidEstructura} as idestructura");
/*doc.cronologia is null AND*/
        $query->Where(
            "drna.idregnumerico IN (
                SELECT dat_mov_reg.idregnumerico
                    FROM DatMovRegnumerico dat_mov_reg
                    INNER JOIN dat_mov_reg.DatMovimientos dat_mov ON dat_mov.idmovimiento = dat_mov_reg.idmovimiento
                    INNER JOIN dat_mov.DatDocumento doc ON doc.iddocumento = dat_mov.iddocumento
                    WHERE  drna.idregnumerico = dat_mov_reg.idregnumerico $reparacion
            )"
        );
        $query->addWhere('drna.valorcontable > drna.valoradquisicion');
        $query->addWhere("drna.esbaja = 0");
        $query->addWhere("drna.estaentidad = 1");
        $datos = $query->fetchArray();
        $query->WhereIn('drna.idarearesp', $areashijas);


        foreach ($datos as &$dat) {
            $dat['area'] = $arrayAreas[$dat['idarearesp']];
        }

        return $datos;

    }

    public function getLlenarIDAreasHijas($result)
    {
        foreach ($result as $resul) {
            $idareas[] = $resul['id'];
        }
        return $idareas;
    }

    /**
     * @param $parametros
     *
     * @return array
     */
    public function obtenerLecturasRecursosConsumidos($parametros)
    {

        $modelDepreciacion = new RegistroDepreciacionModel();
        return $modelDepreciacion->obtenerRecuperacionDepreciacion($parametros);
    }

}
