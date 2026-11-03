<?php

/**
 * Modelo de negocio para gestionar los tipos de nómina.
 *
 * @author Ing. Aroldo L. Hechavarría Hechavarría.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomTipoNomina, Entidad tipo de nómina (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class DatPersonaBrigadaModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function DatPersonaBrigadaModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de los tipos de nómina.
     *
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de tipos de nómina.
     */
    
    public function obtenerListadoPersonasBrigada($inicio = 0, $limite = 10, $idplantilla, $identidad)
    {
        $arrayfinal = array();
        $cont = 0;
        $resultado = DatPersonaBrigada::obtenerListadoPersonasBrigada($inicio = 0, $limite = 10, $idplantilla, $identidad);
        foreach ($resultado as $i => $value) {
            $datosescala = $this->integrator->metadatos->obtenerDatosCargo($value['idcargo']);
            $arrayfinal[$cont]['idpersona'] = $value['idpersona'];
            $arrayfinal[$cont]['idpersonabrigada'] = $value['idpersonabrigada'];
            $arrayfinal[$cont]['grupoescala'] = $datosescala[0]['grupocomplejidad'];
            $arrayfinal[$cont]['importe'] = $value['importe'];
            $arrayfinal[$cont]['trt'] = $value['trt'];
            $arrayfinal[$cont]['ft'] = $value['ft'];
            $arrayfinal[$cont]['evaluacion'] = $value['evaluacion'];
            $arrayfinal[$cont]['salarioeval'] = $value['salarioeval'];
            $arrayfinal[$cont]['salariotrt'] = $value['salariotrt'];
            $arrayfinal[$cont]['montocobrar'] = $value['montocobrar'];
            $arrayfinal[$cont]['numid'] = $value['numid'];
            $arrayfinal[$cont]['denominacion'] = $value['denominacion'];
            $arrayfinal[$cont]['nombreapellidos'] = $value['nombre'] . ' ' . $value['snombre'] . ' ' . $value['papel'] . ' ' . $value['sapel'];          
            $arrayfinal[$cont]['ordenunico'] = $value['ordenunico'];            
            $arrayfinal[$cont]['idcargo'] = $value['idcargo'];            
            $cont++;
        }

        return $arrayfinal;
    }
    
    public function obtenerListadoPersonasBrigadaHistorico($inicio = 0, $limite = 10, $idplantilla, $identidad, $periodo, $idnomtipodestajo)
    {
        $arrayfinal = array();
        $cont = 0;
        
        $respuesta = DatPersonaBrigada::obtenerListadoPersonasBrigadaHistorico($inicio = 0, $limite = 10, $idplantilla, $identidad, $periodo, $idnomtipodestajo);

        if ($idplantilla != null) {            
            foreach ($respuesta as $i => $value) {
                if ($value['idplantillanominal'] == $idplantilla) {
                    $arrayfinal[$cont]['idpersona'] = $value['idpersona'];
                    $arrayfinal[$cont]['idpersonabrigada'] = $value['idpersonabrigada'];  
                    $arrayfinal[$cont]['idplantillanominal'] = $value['idplantillanominal'];  
                    $arrayfinal[$cont]['idgrupoescala'] = $value['idgrupoescala'];  
                    $arrayfinal[$cont]['importe'] = $value['importe'];
                    $arrayfinal[$cont]['trt'] = $value['trt'];
                    $arrayfinal[$cont]['ft'] = $value['ft'];
                    $arrayfinal[$cont]['evaluacion'] = $value['evaluacion'];
                    $arrayfinal[$cont]['salarioeval'] = $value['salarioeval'];
                    $arrayfinal[$cont]['salariotrt'] = $value['salariotrt'];
                    $arrayfinal[$cont]['montocobrar'] = $value['montocobrar'];
                    $arrayfinal[$cont]['identidad'] = $value['identidad'];
                    $arrayfinal[$cont]['denominacion'] = $value['denominacion'];
                    $arrayfinal[$cont]['numid'] = $value['numid'];
                    $arrayfinal[$cont]['denominacion'] = $value['denominacion'];
                    $arrayfinal[$cont]['nombreapellidos'] = $value['nombre'] . ' ' . $value['snombre'] . ' ' . $value['papel'] . ' ' . $value['sapel'];          
                    $arrayfinal[$cont]['ordenunico'] = $value['nombre'];            
                    $arrayfinal[$cont]['ordenunico'] = $value['snombre'];            
                    $arrayfinal[$cont]['ordenunico'] = $value['papel'];            
                    $arrayfinal[$cont]['ordenunico'] = $value['sapel'];            
                    $arrayfinal[$cont]['ordenunico'] = $value['ordenunico'];            
                    $arrayfinal[$cont]['idcargo'] = $value['idcargo'];            
                    $arrayfinal[$cont]['orden'] = $value['orden'];            
                    $cont++;
                }                
            }            

        } else {          
            foreach ($respuesta as $i => $value) {
                $arrayfinal[$cont]['idpersona'] = $value['idpersona'];
                $arrayfinal[$cont]['idpersonabrigada'] = $value['idpersonabrigada'];  
                $arrayfinal[$cont]['idplantillanominal'] = $value['idplantillanominal'];  
                $arrayfinal[$cont]['idgrupoescala'] = $value['idgrupoescala'];  
                $arrayfinal[$cont]['importe'] = $value['importe'];
                $arrayfinal[$cont]['trt'] = $value['trt'];
                $arrayfinal[$cont]['ft'] = $value['ft'];
                $arrayfinal[$cont]['evaluacion'] = $value['evaluacion'];
                $arrayfinal[$cont]['salarioeval'] = $value['salarioeval'];
                $arrayfinal[$cont]['salariotrt'] = $value['salariotrt'];
                $arrayfinal[$cont]['montocobrar'] = $value['montocobrar'];
                $arrayfinal[$cont]['identidad'] = $value['identidad'];
                $arrayfinal[$cont]['denominacion'] = $value['denominacion'];
                $arrayfinal[$cont]['numid'] = $value['numid'];
                $arrayfinal[$cont]['denominacion'] = $value['denominacion'];
                $arrayfinal[$cont]['nombreapellidos'] = $value['nombre'] . ' ' . $value['snombre'] . ' ' . $value['papel'] . ' ' . $value['sapel'];          
                $arrayfinal[$cont]['nombre'] = $value['nombre'];            
                $arrayfinal[$cont]['snombre'] = $value['snombre'];            
                $arrayfinal[$cont]['papel'] = $value['papel'];            
                $arrayfinal[$cont]['sapel'] = $value['sapel'];          
                $arrayfinal[$cont]['ordenunico'] = $value['ordenunico'];            
                $arrayfinal[$cont]['idcargo'] = $value['idcargo'];            
                $arrayfinal[$cont]['orden'] = $value['orden'];            
                $cont++;
                               
            }   
            
        }//int_r($arrayfinal);die; 

        return $arrayfinal;

        
    }
    
    public function adicionarPersonasByBrigada($arrayidpersonas, $idplantilla, $identidad)
    {
        
        $respuesta = DatPersonaBrigada::adicionarPersonasByBrigada($arrayidpersonas, $idplantilla, $identidad);

        return $respuesta;
    }
    
    public function eliminarPersonasByBrigada($arrayidpersonabrigada)
    {
        
        $respuesta = DatPersonaBrigada::eliminarPersonasByBrigada($arrayidpersonabrigada);

        return $respuesta;
    }
    
    public function syncronisarElementosAsosiadosalCargo($idplantilla, $finicio, $ffin, $idconfreportescertificaciones, $identidad)
    {
        $respuesta = new stdClass();
        $arraycausas = array();
        $arrayfinal = array();
        $arraycausas[0] = 'RTD-TRT';
        $arraycausas[1] = 'RTD-FTP';
        
        $arraydatos = DatPersonaBrigada::obtenerDatosElementodAosiadosalCargo($idplantilla, $identidad);

        foreach ($arraydatos as $pers) {
            $arrayidpersonas[] = $pers['idpersona'];
        }

        $personasapa = ZendExt_IoC_Inter::getInstance()->regimentrabajo->GetAPA($arrayidpersonas, $finicio, $ffin, $arraycausas, $identidad);   

        foreach ($arraydatos as $i => $per) {
            foreach ($personasapa as $j => $tr) {
                if ($per['idpersona'] == $tr['idpersona']) {
                    $arrayfinal[$i]['idpersonabrigada'] = $per['idpersonabrigada'];
                    $arrayfinal[$i]['idpersona'] = $per['idpersona'];
                    $arrayfinal[$i]['idcargo'] = $per['idcargo'];
                    $arrayfinal[$i]['TRT'] = $tr['RTD-TRT'];                   
                    $arrayfinal[$i]['FT'] = $tr['RTD-FTP'];                   
                }
            }
        }


        DatPersonaBrigada::insertarDatosPersonaBrigada($arrayfinal);

        $respuesta->codigo = 1;

        return $respuesta;
    }
    
    public function calcularSalarios($idplantilla, $identidad)
    {
        $respuesta = new stdClass();
        
        $arraydatos = DatPersonaBrigada::obtenerListadoPersonasBrigada($inicio = 0, $limite = 10, $idplantilla, $identidad);        
        $respuesta = DatPersonaBrigada::insertarSalarios($arraydatos);

        $respuesta->codigo = 1;

        return $respuesta;
    }
    
    public function guardarEvaluacion($idplantilla, $arraydatos)
    {
        $respuesta = new stdClass();
              
        $respuesta = DatPersonaBrigada::insertarEvaluacion($idplantilla, $arraydatos);

        $respuesta->codigo = 1;

        return $respuesta;
    }
    
    public function obtenerSalarioCalculado($idplantilla)
    {
        $respuesta = new stdClass();
        $sumatoria = 0;
              
        $respuesta = DatPersonaBrigada::obtenerListadoPersonasBrigada($inicio = 0, $limite = 10, $idplantilla, $identidad);

        foreach ($respuesta as $key => $value) {
            $sumatoria += $value['salarioeval'];
        }

        return $sumatoria;
    }
    
    public function guardarMontoCobrar($idplantilla, $coeficiente, $identidad)
    {
        $respuesta = new stdClass();

        $arraydatos = DatPersonaBrigada::obtenerListadoPersonasBrigada($inicio = 0, $limite = 10, $idplantilla, $identidad);
              
        DatPersonaBrigada::insertarMontoCobrar($arraydatos, $idplantilla, $coeficiente);

        $respuesta->codigo = 1;

        return $respuesta;
    }
}
