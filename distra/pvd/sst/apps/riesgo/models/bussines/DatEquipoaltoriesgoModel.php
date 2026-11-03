<?php 
class DatEquipoaltoriesgoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getEquipoaltoriesgoByEstructura($idestructura, $filtro = null, $limit = null, $start = 0)
    {
        try {
            if(!empty($idestructura)) {
                $idestructura = $this->global->Estructura->idestructura;
            }
            $hijosest =  ZendExt_IoC::getInstance()->metadatos->DameHijosInternas($idestructura);
            $estructuras = array($idestructura);
            foreach ($hijosest as $est) {
                array_push($estructuras, $est->id);
            }
            $obj = new DatEquipoaltoriesgo();
            $datos = $obj->getEquipoaltoriesgoByEstructura($estructuras, $filtro, $start, $limit);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $p => $equipos) {
                    $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($equipos['idestructura']);
                    $datos[$p]['estructura'] = $estructura[0]->denominacion;
                    $pais = ZendExt_IoC::getInstance()->datosmaestros->obtenerPais($equipos['idpaisfabricante']);
                    $datos[$p]['pais'] = $pais['nombrepais'];
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = $obj->getCantEquipoaltoriesgoByEstructura($estructuras, $filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addEquipoaltoriesgo($idestructura, $idclasifequipo, $denominacion, $inventario, $modelo, $idpaisfabricante, $annofabricacion, $serie, $presioncalculo, $presionautorizada, $capacidadcalculo, $capacidadautorizada, $ubicacion)
    {
        try {
            $obj = new DatEquipoaltoriesgo();
            $obj->idestructura = $idestructura;
            $obj->idclasifequipo = $idclasifequipo;
            $obj->denominacion = $denominacion;
            $obj->inventario = $inventario;
            $obj->modelo = $modelo;
            $obj->idpaisfabricante = (empty($idpaisfabricante)) ? null :$idpaisfabricante;
            $obj->annofabricacion = (empty($annofabricacion)) ? null :$annofabricacion;
            $obj->serie = $serie;
            $obj->presioncalculo = (empty($presioncalculo)) ? null :$presioncalculo;
            $obj->presionautorizada = (empty($presionautorizada)) ? null :$presionautorizada;
            $obj->capacidadcalculo = (empty($capacidadcalculo)) ? null :$capacidadcalculo;
            $obj->capacidadautorizada = (empty($capacidadautorizada)) ? null :$capacidadautorizada;
            $obj->ubicacion = $ubicacion;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
    
    public function modEquipoaltoriesgo($idequipoaltoriesgo, $idestructura, $idclasifequipo, $denominacion, $inventario, $modelo, $idpaisfabricante, $annofabricacion, $serie, $presioncalculo, $presionautorizada, $capacidadcalculo, $capacidadautorizada, $ubicacion)
    {
        try {
            $obj = DatEquipoaltoriesgo::getById($idequipoaltoriesgo);
            $obj->idestructura = $idestructura;
            $obj->idclasifequipo = $idclasifequipo;
            $obj->denominacion = $denominacion;
            $obj->inventario = $inventario;
            $obj->modelo = $modelo;
            $obj->idpaisfabricante = (empty($idpaisfabricante)) ? null : $idpaisfabricante;
            $obj->annofabricacion = (empty($annofabricacion)) ? null : $annofabricacion;
            $obj->serie = $serie;
            $obj->presioncalculo = (empty($presioncalculo)) ? null : $presioncalculo;
            $obj->presionautorizada = (empty($presionautorizada)) ? null : $presionautorizada;
            $obj->capacidadcalculo = (empty($capacidadcalculo)) ? null : $capacidadcalculo;
            $obj->capacidadautorizada = (empty($capacidadautorizada)) ? null : $capacidadautorizada;
            $obj->ubicacion = $ubicacion;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
    
    public function delEquipoaltoriesgo($idequipoaltoriesgo)
    {
        try {
            $obj = DatEquipoaltoriesgo::getById($idequipoaltoriesgo);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}