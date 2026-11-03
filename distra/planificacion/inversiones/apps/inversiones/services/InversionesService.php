<?php

class InversionesService
{

    public function actualizarPrecioIndicadores($indicadores, $configColumnas = array(), $rectora = false)
    {
        return NomIndicador::actualizarPrecioIndicadoresService($indicadores, $configColumnas, $rectora);
    }
 public function obtenerPlanesDadoEntidad( $identidades, $filtro,$start,$limit)
    {
     
        return DatModelo::obtenerPlanesDadoEntidad($identidades,$filtro,$start,$limit);
    }
     public function obtenerActividadyNorma($nivel, $idactividad, $filtro,$start,$limit,$hijo)
    {
                                        
        return NomActividad::obtenerActividadyNorma($nivel, $idactividad, $filtro,$start,$limit,$hijo);
    }
    
    public function actualizarIndicadores($indicadores, $configColumnas = array(), $rectora = false)
    {
        return NomIndicador::actualizarIndicadoresService($indicadores, $configColumnas, $rectora);
    }

    public function adicionarActualizarIndicadores($indicadores, $configColumnas = array(), $rectora = false)
    {
        return NomIndicador::adicionarActualizarIndicadores($indicadores, $configColumnas, $rectora);
    }

    public function actualizarActividades($actividades, $configColumnas = array(), $rectora = false)
    {
        return NomActividad::actualizarActividadesService($actividades, $configColumnas, $rectora);
    }

    public static function exportarindicadores()
    {
        $dir_rel_app = Zend_Registry::get('config')->uri_aplication;
        $dir_controller = '/planificacion/planmeta/index.php/exportarindicadores/exportarindicadores';
        header("Location: $dir_controller");
    }
    //obtiene un organo que satisface dado un id
        public function ObtenerDenomOACEporId($idorganosatisface)
    {
        return Nomrganosatisface::ObtenerDenomOACEporId($idorganosatisface);
    }
    
    //obtiene todos los organos que satisfacen
        public function obtenerOS()
    {
        return NomOrganosatisface::obtenerOS();
    }
    //obtiene todas las vias de adquisicion
       public function Obtener_via_adquisicion()
    {
        return NomViaadquisicion::Obtener_via_adquisicion();
    }
    //obtiene los datos de la via que especifica el id
      public function obtenerViaDadoId($idvia)
    {
        return NomViaadquisicion::obtenerViaDadoId($idvia);
    }
    
    //obtiene los modelos asociados a una estructura
      public function obtenerModelos($idEstructura)
    {
        return DatEntidadmodelo::servBP_getModeloAsocEntidad($idEstructura);
    } 
    //obtiene los modelos asociados a una estructura
      public function obtenerCentrosDeBalance($arrayentidades)
    {
        return DatEntidaddatosnomenclador::getCentrosDeBalance($arrayentidades);
    }

    //este metodo es para heredar las clases
    public function initComponent()
    {
        //print_r('viste lo que formaste');die;
        return true;
    }

}

?>
