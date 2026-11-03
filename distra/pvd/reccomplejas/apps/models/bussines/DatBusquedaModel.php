<?php

class DatBusquedaModel extends ZendExt_Model
{

    public function DatBusquedaModel()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatBusqueda $DatBusqueda)
    {
        $DatBusqueda->save();
    }

    public function Actualizar(DatBusqueda $DatBusqueda)
    {
        $DatBusqueda->save();
    }

    public function Eliminar($DatBusqueda)
    {
        $DatBusqueda->delete();
    }

    public function getArrIdTablaBaseBusqueda($sqlBusqueda, $paramsCompartimentacion)
    {
        $query = Doctrine_Manager::getInstance();
        $result = $query->getCurrentConnection()->execute($sqlBusqueda, $paramsCompartimentacion)->fetchAll(
            PDO::FETCH_ASSOC
        );
        $strIdEventos = '';
        foreach ($result as $key => $value) {
            $strIdEventos .= ($key == '0' ? '' : ',') . $value['_idtablabase'];
        }
        return $strIdEventos;
    }

    public function existeBusqueda($denominacionBusqueda)
    {
        $idusuario = $this->global->Perfil->idusuario;
        $existe = DatBusqueda::existeBusqueda($idusuario, $denominacionBusqueda);
        if ($existe) {
            return true;
        }
        return false;
    }

    public function getBusquedasByUserConf($idconfiguracion, $idusuario)
    {
        $objDatBusqueda = new DatBusqueda();
        $arrBusquedas = $objDatBusqueda->getBusquedas($idconfiguracion, $idusuario);
        return $arrBusquedas;
    }

    public function getObjJsonConfiguracion($campos, $condiciones, $orderby, $operacion)
    {
        $objConfiguracion = new stdClass();
        //Selectores
        foreach ($campos as $i => $campo) {
            $objConfiguracion->selectores[$i]->idcampo = $campo->idcampo;
            $objConfiguracion->selectores[$i]->esquema = $campo->esquema;
            $objConfiguracion->selectores[$i]->tabla = $campo->tabla;
            $objConfiguracion->selectores[$i]->campo = $campo->campo;
            $objConfiguracion->selectores[$i]->alias = $campo->alias;
            $objConfiguracion->selectores[$i]->alias = $campo->alias;
            $objConfiguracion->selectores[$i]->obligatorio = $campo->obligatorio;
            $objConfiguracion->selectores[$i]->anchocolumna = $campo->anchocolumna;
            $objConfiguracion->selectores[$i]->expander = $campo->expander;
            $objConfiguracion->selectores[$i]->renderer = $campo->renderer;
            $objConfiguracion->selectores[$i]->agruparcampo = $campo->agruparcampo;
        }
        //Condiciones
        if (count($condiciones) > 0) {
            foreach ($condiciones as $i => $condicion) {
                $objConfiguracion->condiciones[$i]->idcampo = $condicion->idcampo;
                $objConfiguracion->condiciones[$i]->denominacion = $condicion->denominacion;
                $objConfiguracion->condiciones[$i]->condicionmostrar = $condicion->condicionmostrar;
                $objConfiguracion->condiciones[$i]->valormostrar = $condicion->valormostrar;
                $objConfiguracion->condiciones[$i]->logico = $condicion->logico;
                $objConfiguracion->condiciones[$i]->mostrarlogico = $condicion->mostrarlogico;
                $objConfiguracion->condiciones[$i]->tipo = $condicion->tipo;
                $objConfiguracion->condiciones[$i]->condicion = $condicion->condicion;
                $objConfiguracion->condiciones[$i]->valor = $condicion->valor;
            }
        } else {
            $objConfiguracion->condiciones = array();
        }

        //Order by
        if (count($orderby) > 0) {
            foreach ($orderby as $i => $orden) {
                $objConfiguracion->orden[$i]->denom = $orden->denom;
                $objConfiguracion->orden[$i]->idcampo = $orden->idcampo;
                $objConfiguracion->orden[$i]->orden = $orden->orden;
            }
        } else {
            $objConfiguracion->orden = array();
        }

        //Operaciones arreglada
        if(count($operacion) >0){
            foreach($operacion as $i=>$r){
                $objConfiguracion->operacion[$i]->campo = $r->campo;
                $objConfiguracion->operacion[$i]->idcampo = $r->idcampo;
                $objConfiguracion->operacion[$i]->tooltip = $r->tooltip;
                $objConfiguracion->operacion[$i]->tipoOperacion = $r->tipoOperacion;
                $objConfiguracion->operacion[$i]->nombreOperacion = $r->nombreOperacion;
                $objConfiguracion->operacion[$i]->esquema = $r->esquema;
                $objConfiguracion->operacion[$i]->tabla = $r->tabla;
            }
        }else{
            $objConfiguracion->operacion = array();
        }
      /*
      //Operacion
       if (empty($operacion)) {
            $objConfiguracion->operacion->nombrecampo = $operacion[0];
            $objConfiguracion->operacion->idcampo = $operacion[1];
        } else {
            $objConfiguracion->operacion = array();
        }*/

        return $objConfiguracion;
    }

}