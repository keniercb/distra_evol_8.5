<?php

class NomTiponomencladorModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function listarTiponomenclador($params) {
        $tiposNomencladores = NomTiponomenclador::listarTiponomenclador($params);
        if (isset($tiposNomencladores[0])) {
            foreach ($tiposNomencladores as $i => $tipo) {
                $tiposNomencladores[$i]['qtip'] = "<p><b>Denominación:</b> &nbsp;&nbsp;" . $tipo[denominacion] . "</p>" .
                        "<p><b>Descripción:</b> &nbsp;&nbsp;" . $tipo[descripcion] . "</p>";
                if ($tipo['configsistema'] == 1)
                    $tiposNomencladores[$i]['text'] = "<b> " . $tipo['text'] . "</b>";
            }
        }
        return $tiposNomencladores;
    }

    public function addModTiponomenclador($params) {
        $d = strtolower($params['denominacion']);
        $objTiponomenclador = Doctrine::getTable('NomTiponomenclador')->findByDql("lower(denominacion) = '$d'");
        if ($params['accion'] == 'adicionar') {
            if ($objTiponomenclador[0]->idtiponomenclador)
                return 0; //ya existe un tiponomenclador con esa denominacion
            else {
                $objTiponomencladorNuevo = new NomTiponomenclador();
                $objTiponomencladorNuevo->denominacion = $params['denominacion'];
                $objTiponomencladorNuevo->descripcion = $params['descripcion'];
                $objTiponomencladorNuevo->uritiponomenclador = strtolower($params['denominacion']);
                $objTiponomencladorNuevo->save();
                NomTiponomenclador::crearUriTipoNomenclador($objTiponomencladorNuevo->idtiponomenclador);
                //adicionando el datosnomenclador por defecto del sistema '-'
                $params['idtiponomenclador'] = $objTiponomencladorNuevo->idtiponomenclador;
                $params['denominacion'] = '-';
                $params['descripcion'] = '-';
                $params['valordefecto'] = 1;
                NomDatosnomencladorModel::addModDatonomenclador($params);
                return $objTiponomencladorNuevo->idtiponomenclador; //operacion realizada
            }
        } else {//modificar    
            if ($objTiponomenclador[0]->idtiponomenclador && $objTiponomenclador[0]->idtiponomenclador != $params['idtiponomenclador'])
                return 0; //ya existe un tiponomenclador con esa denominacion
            else {
                $objTiponomencladorNuevo = Doctrine::getTable('NomTiponomenclador')->find($params['idtiponomenclador']);
                $objTiponomencladorNuevo->denominacion = $params['denominacion'];
                $objTiponomencladorNuevo->descripcion = $params['descripcion'];
                $objTiponomencladorNuevo->uritiponomenclador = strtolower($params['denominacion']);
                $objTiponomencladorNuevo->save();
                NomTiponomenclador::crearUriTipoNomenclador($params['idtiponomenclador']);
                return $params['idtiponomenclador']; //operacion realizada
            }
        }
    }

    public function eliminarTiponomenclador($params) {
        $objTiponomenclador = Doctrine::getTable('NomTiponomenclador')->find($params['idtiponomenclador']);
        try {
            $objTiponomenclador->delete();
            return 1; //operacion realizada
        } catch (Exception $e) {
            return 0; //no se pudo eliminar porque está en uso
        }
    }

    //esto es para calculo de raciones, ver si se mantiene ese componente
    public function listarNomCalculoNiveles() {
        $query = new Doctrine_Query();
        return $query->select('n.idtiponomenclador,n.denominacion,dct.idconftiponomesp')
                        ->from('NomTiponomenclador n')
                        ->innerJoin('n.DatTipocomponentetiponomenclador tctn')
                        ->innerJoin("tctn.NomTipocomponenteplanif c WITH upper(c.denominacion) = 'NIVELES'")
                        ->innerJoin('n.DatConftiponomesp dct')
                        ->execute()
                        ->toArray(true);
    }

}
