<?php

/**
 * Clase especializada en el trabajo con los servicios
 *  que se utilizan de seguridad
 *
 *
 */
class ServiciosGISHelper implements ISingletonClass
{

    /**
     * Variables internas de la clase
     *
     */
    private $integrator = null;
    private $varglobal = null;

    /**
     * Inicializando las variables
     *
     */
    private function __construct()
    {
        $this->integrator = ZendExt_IoC::getInstance();
        $this->varglobal = ZendExt_GlobalConcept::getInstance();
    }

    /**
     * Una instancia unica de ServiciosSeguridadHelper
     *
     * @var ServiciosSeguridadHelper
     */
    private static $instance = null;

    /**
     * Creates a new instance of class ServiciosSeguridadHelper
     *
     * @return ServiciosSeguridadHelper
     */
    static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new ServiciosGISHelper();
        }
        return self::$instance;
    }

    public function integrado(){        
        $dir_index = $_SERVER['SCRIPT_FILENAME'];
        //$ioc_file = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'apps/gis/comun/recursos/xml/ioc.xml';        
        $ioc_file = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'apps/fleetControl/comun/recursos/xml/ioc.xml';
        if(file_exists($ioc_file)){            
            return true;
        }else{            
            return false;
        }
    }
    
    public function insertarUnidad($arrparametros){
        /*
        ->fleetControl->insertarUnidad
        <parametro nombre="idmedio" tipo="integer"/>                //id de medio (estructura)
        <parametro nombre="medio" tipo=""/>                        //denominacion del medio
        <parametro nombre="categoria" tipo="integer"/>                //categoria (1 - Aéreo, 2 - Marítimo, 3 - Terrestre)
        <parametro nombre="idgps" tipo=""/>                        //identificador de gps (string)
        <parametro nombre="matricula" tipo=""/>                        //matricula

        <!--NO SON OBLIGATORIOS-->
        <parametro nombre="indicativo" tipo=""/>                //indicativo
        <parametro nombre="norma" tipo="integer"/>                //norma de combustible(indice de consumo)
        <parametro nombre="auxiliares" tipo="array"/>                //otros datos

        <!--Resultado-->                                
        -cuando se inserta satisfactoriamente retorna                                          array('success' => true, 'msg' => 'insertado', 'id' => <<valor del identificador de la unidad>>)
        -cuando ya existe una unidad con la misma matricula  returna                           array('success' => false, 'msg' => 'matricula')
        -cuando ya existe una unidad con el mismo identificador gps returna                 array('success' => false, 'msg' => 'idgps')
        -cuando ya existe una unidad con el mismo indicativo  returna                        array('success' => false, 'msg' => 'indicativo')
        -cuando ya no se  puede asignar mas unidades a una plantilla returna                array('success' => false, 'msg' => 'existe')
        -cuando ocurre un error retorna                                                 array('success' => false, 'msg' => 'excepcion', 'excepcion' => <<descripcion del error>>)
        */
        
        /*$new_include_path = get_include_path() . ';D:/Work/REPOS/git/sige/apps/\fleetControl/comun/adapter';        
        set_include_path($new_include_path);*/
        
        $idestructuramedio = $arrparametros['idestructuramedio'];        
        $medio = $arrparametros['denominacion'];
        $categoria = $arrparametros['categoria'];
        $idgps = $arrparametros['idgps'];
        $matricula = $arrparametros['matricula'];
        
        $indicativo = $arrparametros['indicativo'];
        $normaconsumo = $arrparametros['indiceconsumo'];
        $auxiliares = $arrparametros['metadata'];
        
        
        $idregistrado = $this->integrator->fleetControl->insertarUnidad(
            $idestructuramedio,
            $medio,
            $categoria,
            $idgps,
            $matricula,
            $indicativo,
            $normaconsumo,
            $auxiliares
        );
        return $idregistrado;
    }

    public function actualizarUnidad($arrdata){
        //$idregistrado = $this->integrator->fleetControl->actualizarUnidad($arrdata);
        return true;//$idregistrado;
    }

    public function eliminarUnidades($arridregistro){
        //$this->integrator->fleetControl->eliminarUnidades($arridregistro);
        return true;
    }
}
