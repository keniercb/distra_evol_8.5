<?php

/**
 * Description of AgrupacionesService
 *
 * @author Gerardo
 */
class AtributosporagrupacionesService extends ZendExt_Model {

    public function getSJArbolAgrupaciones() {
        return '
        <script type="text/javascript" src="/configuracion/agrupaciones/views/js/atributosporagrupaciones/treedeagrupaciones.cmp.js"></script>';
    }

    public function getAgrupacionIndicador($parametros) {
        $query = $this->filtro($parametros);
        $result = $query->select('confai.idatributoindicador,
                                   confai.idatributo as idatributo,
                                   confai.idcampo as idcampo,
                                   confai.idindicador as idindicador,
                                   daest.denominacion as denomatributoestatico,
                                   dcamp.idcampo as idcampo,
                                   dcamp.idtabla as idtabla,
                                   nagru.denominacion as denomagrupaciones,
                                   dcamp.denominacion as dencampo')
                ->from('DatConfAtributoIndicador confai')
                ->innerJoin('confai.DatAtributoestatico daest')
                ->innerJoin('confai.DatCampo dcamp')
                ->innerJoin('daest.NomAgrupacion nagru')
                ->fetchArray();
        return $result;
    }

    /*
     * retorna los datos dinamicos asociados el indicador por las agrupaciones de atributos
     * p@arams: {idindicador ->el id del indicador.
     *           idtabla -> la tabla que tiene los datos dinamicos del indicador
     *           }
     */

    public function getAtributosAgrupacionIndicador($parametros) {
        $campo = new DatCampo();
        $resul = array();
        $datos = $campo-> cargarCampos($parametros['idtabla']);
        $agrupaciones = $this->getAgrupacionIndicador($parametros);
        foreach ($datos as $key => $value) {
            if ($value['DatComponente']['etiqueta']) {
                $obj = new stdClass();
                $obj->idcampo = $value['idcampo'];
                $obj->nameInTabla = $datos[$key]['denominacion'];
                $obj->permitenulo = $value['permitenulo'];
                $obj->label = $value['DatComponente']['etiqueta'];
                $obj->name = 'idcampo';
                $obj->agrupacion = 'Otros datos';
                foreach ($agrupaciones as $key => $agrup) {
                    if ($value['idcampo'] == $agrup['idcampo']) {
                        $obj->agrupacion = $agrup['denomagrupaciones'];
                        break;
                    }
                }
                array_push($resul, $obj);
            }
        }
        return $resul;
    }

    public function filtro($parametros) {
        $query = new Doctrine_Query();
        $query->where('confai.idindicador = ?', array($parametros['idindicador']));
        if ($parametros['nivelnomenclador'] == 1) {
            $query->addWhere('daest.nivelnomenclador = ?', array(1));
        }
        if ($parametros['nivelnomenclador'] == -1) {
            $query->addWhere('daest.nivelnomenclador = ?', array(-1));
        }
        return $query;
    }

}
