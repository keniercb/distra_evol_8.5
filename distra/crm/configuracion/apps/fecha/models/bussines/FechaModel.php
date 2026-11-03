<?php

/**
  * Componente para gestionar las fechas de los subsistemas.
  *
  * @package    Configuración
  * @subpackage Fecha/Models/Bussines
  * @copyright  XETID
  * @version    1.0
  */
class FechaModel extends ZendExt_Model
{
    /**
       * Constuctor de la clase
      */
    public function __construct()
    {
        $this->of = new OperacionesFechas();
        $this->fechaestado = array();
        parent::ZendExt_Model();
    }
        /**
          * Busca una Fecha
          *
          * @param int $identidad Identificador de entidad
          * @param int $idsubsistema Identificador de subsistema
          *
          * @return object Devuelve un objeto de tipo fecha
          */
    public function fechaContableSubsistema($identidad, $idsubsistema) 
    {
        $estructurasubsist = $this->integrator->datosmaestros->buscarInstancia($identidad, $idsubsistema);
        $result = DatFechaconf::BuscarFecha($estructurasubsist->idestructurasubsist);
        $r = $result[0]['fecha'];
        $m = explode('-', $r);
        $r = $m[2] . '/' . $m[1] . '/' . $m[0];
        return $r;
    }
     /**
       * Actualiza un objeto fecha de un subsistema.
       *
       * @param int $identidad Identificador de entidad
       * @param int $idsubsistema Identificador de subsistema
       * @param object $fecha Objeto de tipo fecha
       * 
       */
    public function actualizarFechaSubsistema($identidad, $idsubsistema, $fecha) 
    {
        $m = explode('/', $fecha);
        $fecha = $m[2] . '-' . $m[1] . '-' . $m[0];
        $estructurasubsist = $this->integrator->datosmaestros->buscarInstancia($identidad, $idsubsistema);
        $asd = DatFechaconf::BuscarFecha($estructurasubsist->idestructurasubsist);
        $dat = Doctrine::getTable('DatFechaconf')->find($asd[0]['idfecha']);
        $dat->fecha = $fecha;
        $dat->save();
    }
     /**
       * Actualiza un objeto fecha.
       *
       * @param DatFechaconf $Fecha Objeto fecha
       * @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacci&oacute;n.
       */
    public function ActualizarFecha(DatFechaconf $fecha) 
    {
        try {
            $fecham = Doctrine::getTable('DatFechaconf')->find($fecha->idfecha);
            $fecham->idfecha = $fecha->idfecha;
            $incremento = DatFechaconf::FechaPorId($fecham->idfecha);
            if ($incremento[0]['incremento'] == 1) {

                self::PasarfechaAutomatica($fecham->idfecha, 2);
                return;
            }
            $fecham->incremento = 2;
            $fecham->version = $fecha->version;
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $fecham->save();
            $cc->commit();
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }
     /**
       * Inserta un objeto fecha.
       *
       * @param DatFechaconf $Fecha Objeto fecha
       * @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacci&oacute;n.
       */
    public function InsertarFecha(DatFechaconf $fecha) 
    {
        try {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $fecha->save();
            $cc->commit();
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF097', $ee);
        }
    }
     /**
       * Devuelve un objeto fecha.
       *
       * @param int $x Identificador del ejercicio
       * @return object Devuelve un objeto de tipo fecha
       */
    public function DevuelveFecha($x) 
    {
        $fecha = $this->integrator->datosmaestros->obtenerEjercicios($x);
        return $fecha[0]->inicio;
    }
     /**
       * Pasa la fecha de un subsistema donde el tipo de incremento sea manual.
       *
       * @param DatFechaconf $Fecha Objeto de tipo fecha
       * @throws @throws Doctrine_Exception $exception Excepci&oacute;n de 
       * doctrine ocurrida durante la transacci&oacute;n.
       */
    public function PasarFechaInd(DatFechaconf $fecha) 
    {
        try {
            $fecham = Doctrine::getTable('DatFechaconf')->find($fecha->idfecha);
            if ($fecham->incremento == 2) {
                $fechareal = date("Y/m/d");
                $fechasist = $fecham->fechasist;
                $fechaant = $fechasist;
                $fechasist = $this->of->nextDate($fechasist, 1);
                $estadp = self::VerificarFechaPeriodo(
                        $this->global->Estructura->idestructura, $this->subsistemaactual, 
                        $fechasist, $fecham->idestructurasubsist
                        );

                self::fechaEx($estadp, $ee, $fechaant);
            } else {
                throw new ZendExt_Exception('CONF090', $ee);
            }

            $fecham->idfecha = $fecha->idfecha;
            $fecham->fechasist = $fechasist;
            $fecham->fecha = $fechareal;
            $fecham->save();
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * @param $estadp
     * @param $ee
     * @param $fechaant
     *
     * @throws ZendExt_Exception
     */
    private function fechaEx($estadp, $ee, $fechaant)
    {
        if (!$estadp) {
            throw new ZendExt_Exception('CONF091', $ee);
        }
        if ($this->subsistemaactual == 1) {
            if (!$this->integrator->contabilidad->ExisteCOSinError($fechaant)) {
                throw new ZendExt_Exception('CONF093', $ee);
            }
        }
        if ($this->subsistemaactual == 4) {
            if (!$this->integrator->capitalhumano->NominasContabilizadas()) {
                throw new ZendExt_Exception('CONF094', $ee);
            }
        }
    }

    /**
       * Pasa la fecha de un subsistema donde el tipo de incremento sea manual.
       *
       * @param int $idsfechas Identificador de fecha  
       * @throws @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacción.
       */
    public function PasarFecha($idsfechas) 
    {
        try {
            $idfechasf = (strpos($idsfechas, ',')) ? split(",", $idsfechas) : array(0 => $idsfechas);
            $fechas = DatFechaconf::BuscarPrecedencias($idfechasf);
            $fecham = new DatFechaconf();
            $fecham->idfecha = $idfechasf[0];
            $this->subsistemaactual = $this->integrator->datosmaestros
            ->buscarEstSubSistPorId($fechas[0]['idestructurasubsist']);
            self::PasarFechaInd($fecham);
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF091', $ee);
        }
    }
     /**
       * Forma el Grid de un subsistema.
       *
       * @param int $identidad identificador de entidad
       * @param int $limit Cantidad de elementos que desea buscar
       * @param int $start indice de inicio de la busqueda 
       * @return array Retorna un arreglo con la cantidad de fechas y con los elementos
       * @throws @throws ZendExt_Exception $e Excepci&oacute;n de Zend ocurrida durante la busqueda.
       */
    public function FormarArregGrid($identidad, $limit, $start) 
    {

        try {
            $arraySubSys = $this->integrator->datosmaestros->buscarSubsistemasPorEntidad($identidad);
            $arrayIdEntidadSubSys = self::ObtenerIdestructsubsis($arraySubSys);
            $arrayFechas = DatFechaconf::Fechas($limit, $start, $arrayIdEntidadSubSys);
            $result = array();
            $i = 0;
            foreach ($arrayFechas[1] as $fecha) {
                foreach ($arraySubSys as $subSistema) {
                    if ($fecha['idestructurasubsist'] == $subSistema->idestructurasubsist) {
                        $fecha['incrementoc'] = $fecha['incremento'];
                        $fecha['idestructurasubsisti'] = $fecha['idestructurasubsist'];
                        $fecha['incremento'] = ($fecha['incremento'] == 1) ? 
                        'Configuraci&oacute;n autom&aacute;tica' : 'Configuraci&oacute;n manual';
                        $fecha['idestructurasubsist'] = $subSistema->NomSubsistema['denominacion'];
                        $result[] = $fecha;
                        $i++;
                    }
                }
            }
            $resultFinal = array('cant' => $arrayFechas[0], 'datos' => $result);
            unset($arrayFechas);
            return $resultFinal;
        } catch (ZendExt_Exception $e) {
            throw $e;
        }
    }
     /**
       * Devuelve las fechas por entidades.
       *
       * @return array Retorna un arreglo con los elementos fechas y sus respectivos id
       * @throws @throws ZendExt_Exception $exception Excepci&oacute;n de Zend ocurrida durante busqueda.
       */
    public function FechasEntidad() 
    {
        try {
            $ids = array();
            $subsistemas = $this->integrator->datosmaestros
            ->buscarSubsistemasPorEntidad($this->global->Estructura->idestructura);
            $idestsubs = self::ObtenerIdestructsubsis($subsistemas);
            $fechas = DatFechaconf::TodaslasFechas($idestsubs);
            $result = array();
            foreach ($fechas as $fec) {
                foreach ($subsistemas as $subs) {
                    if ($fec['idestructurasubsist'] == $subs->idestructurasubsist) {
                        $fec['idsubsistema'] = $subs->idsubsistema;
                        $result[$fec['idestructurasubsist']] = $fec;
                        $ids[] = $fec['idfecha'];
                    }
                }
            }
            unset($fechas);

            return array($result, $ids);
        } catch (ZendExt_Exception $e) {
            throw $e;
        }
    }
     /**
       * Detecta los precedentes
       * 
       * @param int $precedencia Identificador de la precedencia
       * @param object $fecha Fecha a comparar con la fecha de la entidad
       * @param int $incremento Tipo de incremento
       * @param object $fechafs Fecha del sistema
       * @return boolean Retorna true en caso de detectar la precedencia falso en otro caso
       * 
       */
    public function DetectarPrecedentes($precedencia, $fecha, $incremento = 2, $fechafs = '') 
    {
       
        $cant = count($this->fechasentidad);
        if ($cant > 1) {
            
            $encmin = false;
            $proxprec = 0;

            foreach ($this->fechasentidad as $k => $prk) {
                if ($prk['precedencia'] == ($precedencia + 1)) {
                    $proxprec = $k;
                    $encmin = true;
                    break;
                }
            }
            if ($encmin) {
                if ($fecha != $this->fechasentidad[$proxprec]['fechasist']) {
                    if ($this->of->compara_fechas($this->fechasentidad[$proxprec]['fechasist'], $fecha)) {
                        if ($incremento == 1) {
                            list($anno, $mes, $dia) = split("-", $fechafs);
                            $fechap = $dia . "-" . $mes . "-" . $anno;
                            if ($fechap != date("d-m-Y")) {
                                $fechadif = $this->of->restaFechas($fechap, date("d-m-Y"));
                            } else {
                                $fecpr = $this->of->nextDate($fecham->fechasist, 1);
                                $fecham.='';
                                $fechadif = $this->of->restaFechas($fechap, $fecpr);
                            }
                            $fechasistema = $this->of->nextDate($fecha, $fechadif);
                            if (!$this->of->compara_fechas($this->fechasentidad[$proxprec]['fechasist'], $fechasistema)
                                && $fechasistema != $this->fechasentidad[$proxprec]['fechasist']) {
                                return false;
                            }
                        }
                        return true;
                    }
                    return false;
                }
                return false;
            }
            if ($this->fechasentidad[0]['precedencia'] == $precedencia) {
                return true;
            }
            return $encmin;
        }
        return false;
    }
     /**
       * Verifica la Fecha por periodo
       * 
       * @param int $identidad Identificador de la entidad
       * @param int $idsusbsistema Identificador del subsistema
       * @param object $fechanueva Tipo de incremento
       * @param int $idsubsistestruct Identificador del subsitema estructura
       * @return boolean Retorna true en caso de que las fechas sean iguales falso en otro caso
       * 
       */
    public function VerificarFechaPeriodo($identidad, $idsusbsistema, $fechanueva, $idsubsistestruct) 
    {
        $fechanueva = self::fechaNueva($fechanueva);
$idsubsistestruct.='';
        $idperiodoactual = $this->integrator->datosmaestros->periodoActualSubsistema($identidad, $idsusbsistema);
        if ($idperiodoactual) {
            $periodoactual = $this->integrator->datosmaestros->obtenerPeriodo($idperiodoactual);
        }
        if (!empty($periodoactual)) {
            list($dia, $mes, $ano) = split("/", $periodoactual->fin);
            list($diaa, $mess, $anoo) = split("/", $periodoactual->inicio);
            $fechaf = $ano . "-" . $mes . "-" . $dia;
            $fechai = $anoo . "-" . $mess . "-" . $diaa;
            
            if ($fechaf == $fechanueva || $fechai == $fechanueva) {
               return true;
            } else {
               
                if (
                        $this->of->compara_fechas($fechaf, $fechanueva) && 
                        $this->of->compara_fechas($fechanueva, $fechai)
                        ) {
                    return true;
                } else {
                    return false;
                }
            }
        }
       
        return true;
       	
    }

    /**
     * @param $fechanueva
     *
     * @return mixed|string
     */
    private function fechaNueva($fechanueva)
    {
        if (ereg("([0-9]{1,2})-([0-9]{1,2})-([0-9]{4})", $fechanueva, $regs)) {
            $fechanueva = $regs[3] . "-" . $regs[2] . "-" . $regs[1];
        }
        if (strpos($fechanueva, "/")) {
            $fechanueva = str_replace("/", "-", $fechanueva);
            return $fechanueva;
        }
        return $fechanueva;
    }

    /**
       * Pasa la fecha de un subsistema donde el tipo de incremento sea autom\xE1tica.
       *
       * @param int $idsfecha Identificador de fecha 
       * @param int $incremento Valor del incremento 
       * @throws @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacción.
       */
    public function PasarfechaAutomatica($idfecha, $incremento = 1) 
    {
        try {
            $fecham = new DatFechaconf();
            $fecham = Doctrine::getTable('DatFechaconf')->find($idfecha);
           
            list($anno, $mes, $dia) = split("-", $fecham->fecha);
            $fechap = $dia . "-" . $mes . "-" . $anno;
            if ($fechap != date("d-m-Y")) {
             
                if ($fechap != date("d-m-Y")) {
                    $fechadif = $this->of->restaFechas($fechap, date("d-m-Y"));
                } else {
                    $fecpr = $this->of->nextDate($fecham->fechasist, 1);
                    $fechadif = $this->of->restaFechas($fechap, $fecpr);
                }

                $fecham->idfecha = $idfecha;
                if ($incremento != 1) {
                    $fecham->incremento = 2;
                }
                
                $fechasistema = $this->of->nextDate($fecham->fechasist, $fechadif);
                

                $fecham->fecha = date("d-m-Y");
                $fecham->fechasist = $fechasistema;
                $version = $fecham->version;
                $fecham->version = $version;
               		  
                $fecham->save();
              	  
            }
        } catch (Doctrine_Exception $ee) {
            $this->conn->rollback();
            throw $ee;
        }
    }
     /**
       * Pasa la fecha de un subsistema donde el tipo de incremento sea autom\xE1tica.
       *
       * @throws @throws ZendExt_Exception $e Excepci&oacute;n de Zend ocurrida durante consulta.
       */
    public function PasarfechaAutomaticageneral() 
    {
        try {
            $fechasentidad = self::FechasEntidad();
            $this->fechasentidad = DatFechaconf::BuscarPrecedencias($fechasentidad[1]);
            $identidad = $this->global->Estructura->idestructura;
            foreach ($fechasentidad[0] as $fent) {
                
                if ($fent['incremento'] == 1) {
                   
                    //$predenc = 1;
                    /*if (!$predenc) {
                      
                        if (!empty($this->fechaestado[$fent['precedencia'] + 1])) {
                        
                            $predenc = true;
                        }
                    }*/

                    //if ($predenc) {
                        $fechasist = self::ObtenerFechaProximAut($fent['fecha'], $fent['fechasist']);
                        $this->subsistemaactual = $fent['idsubsistema'];
                       
                        if ($fechasist == NULL) {
                            break;
                        }
                      
                        $estadp = self::VerificarFechaPeriodo(
                        $identidad, $this->subsistemaactual, $fechasist, $fent['idestructurasubsist']
                        );
                  
                        unset($this->subsistemaactual);
                        unset($fechasist);
                        if (!$estadp) {
                            throw new ZendExt_Exception('CONF139', $e);
                        }
                        if ($this->subsistemaactual == 4) {
                            if (!$this->integrator->contabilidad->ExisteCOSinError($fechasist)) {
                                break;
                            }
                        }
                        if ($this->subsistemaactual == 7) {
                            if (!$this->integrator->capitalhumano->NominasContabilizadas()) {
                                break;
                            }
                        }
                   
                        $this->PasarfechaAutomatica($fent['idfecha']);
                    //}
                }
            }
        
        } catch (ZendExt_Exception $e) {
            throw new ZendExt_Exception('CONF099', $e);
        }
    }
     /**
       * Pasa la fecha de un subsistema donde el tipo de incremento sea autom\xE1tica.
       * 
       * @param object $objfecha Objeto de tipo fecha
       * @return boolean true en caso de que la fecha pase automaticamente false en otro caso
       * @throws @throws ZendExt_Exception $e Excepci&oacute;n de Zend ocurrida durante consulta.
       */
    public function PasarfechaAutomatSubsist($objfecha) 
    {
        try {
            $fechasentidad = $this->FechasEntidad();
            $this->fechasentidad = DatFechaconf::BuscarPrecedencias($fechasentidad[1]);
            $identidad = $this->global->Estructura->idestructura;
            $predenc = 1; 
            if ($predenc) {
                $fechasist = self::ObtenerFechaProximAut($objfecha->fecha, $objfecha->fechasist);
                $this->subsistemaactual = $objfecha->idsubsistema;
                if ($fechasist == NULL) {
                    return false;
                }
                $estadp = self::VerificarFechaPeriodo(
                        $identidad, $this->subsistemaactual, $fechasist, $objfecha->idestructurasubsist
                        );
                unset($this->subsistemaactual);
                unset($fechasist);
                if (!$estadp) {
                    throw new ZendExt_Exception('CONF139', $e);
                }

                if ($this->subsistemaactual == 4) {
                    if (!$this->integrator->contabilidad->ExisteCOSinError($fechasist)) {
                        return false;
                    }
                }
                if ($this->subsistemaactual == 7) {
                    if (!$this->integrator->capitalhumano->NominasContabilizadas()) {
                        return false;
                    }
                }

                self::PasarfechaAutomatica($objfecha->idfecha);
                return true;
            }
        } catch (ZendExt_Exception $e) {
            throw new ZendExt_Exception('CONF099', $e);
        }
    }
     /**
       * Obtener la proxima fecha de un subsistema donde el tipo de incremento sea autom\xE1tica
       * 
       * @param object $fecha Objeto de tipo fecha
       * @param object $fechasist Objeto de tipo fecha, la fecha del sistema
       * @return object Retorna un objeto de tipo fecha
       * 
       */
    public function ObtenerFechaProximAut($fecha, $fechasist) 
    {
        list($anno, $mes, $dia) = split("-", $fecha);
        $fechap = $dia . "-" . $mes . "-" . $anno;
        if ($fechap != date("d-m-Y")) {
            $fechadif = $this->of->restaFechas($fechap, date("d-m-Y"));
            $fechasistema = $this->of->nextDate($fechasist, $fechadif);
            return $fechasistema;
        }
        return date("d-m-Y");
    }
     /**
       * Obtener los id de estructura del los subsistemas
       * 
       * @param array $subsistent Arreglo de subsistemas
       * @return array Retorna un arreglo con los id de estructura de los subsistemas
       * @throws @throws ZendExt_Exception $e Excepci&oacute;n de Zend ocurrida durante consulta.
       */
    public function ObtenerIdestructsubsis($subsistent = array()) 
    {
        if (!empty($subsistent)) {
            $idsubsitent = array();
            foreach ($subsistent as $subs) {
                $idsubsitent[] = $subs->idestructurasubsist;
            }
            return $idsubsitent;
        } else {
            throw new ZendExt_Exception('CONF150');
        }
    }
     /**
       * Obtener los subsistemas por dado el id de una entidad
       * 
       * @param int $agIdEntidad Identificador de entidad
       * @return array Retorna un arreglo con los subsistemas
       * 
       */
    public function getSubSistemasByEntidad($agIdEntidad) 
    {
        $arraySubSistema = $this->integrator->datosmaestros->buscarSubsistemasPorEntidad($agIdEntidad);
        foreach ($arraySubSistema as $index => $subsistema) {
            $nomSubsistema = $subsistema->NomSubsistema;
            $arraySubSistema[$index]->idsubsistema = $nomSubsistema['idsubsistema'];
            $arraySubSistema[$index]->denominacion = $nomSubsistema['denominacion'];
            $arraySubSistema[$index]->crc = $nomSubsistema['crc'];
            $arraySubSistema[$index]->uri = $nomSubsistema['uri'];
            $arraySubSistema[$index]->cierra = $nomSubsistema['cierra'];
            $arraySubSistema[$index]->fecha = $nomSubsistema['fecha'];
            $arraySubSistema[$index]->precedencia = $nomSubsistema['precedencia'];
            unset($subsistema->NomSubsistema);
        }
        return $arraySubSistema;
    }
 


 /**
       * Obtener la m\xE1xima precedencia
       * 
       * 
       * @return int Retorna un valor entero que indica la m\xE1xima precedencia
       * 
       */
    public function ObtenerMaxPrecedencia() 
    {
        $fechasentidad = $this->FechasEntidad();
        $this->fechasentidad = DatFechaconf::BuscarPrecedencias($fechasentidad[1]);
        $maxprecedencia = 1;
        foreach ($this->fechasentidad as $pr) {
            if ($pr['precedencia'] > $maxprecedencia) {
                $maxprecedencia = $pr['precedencia'];
            }
        }
        return $maxprecedencia;
    }
     /**
       * Obtener la fecha siguiente
       * 
       * @param object $fecha Objeto de tipo fecha
       * @param int $incremento Tipo de incremento dado un valor 
       * @return object Retorna un Objeto de tipo Fecha
       * 
       */
    public function proximaFecha($fecha, $incremento) 
    {
        return $this->of->nextDate($fecha, $incremento);
    }
     /**
       * Le da un formato estandar a la fecha en caso de que esta no lo tenga
       * 
       * @param object $fecha Objeto de tipo fecha
       * @return object Retorna un Objeto de tipo Fecha formateada
       * 
       */
    public function FormatearFecha($fecha) 
    {
        return $this->of->FormatFechas($fecha);
    }
     /**
       * Dado un objeto fecha pasa la fecha autom\xE1tica.
       * 
       * @param object $objfecha Objeto de tipo fecha
       * @return boolean Verdadero en caso de pasar la fecha falso en otro caso
       * @throws @throws ZendExt_Exception $e Excepci&oacute;n de Zend ocurrida durante consulta.
       */
    public function PasarfechaAutL($objfecha)
    {
        try {
            $global = ZendExt_GlobalConcept::getInstance();
            $identidad = $global->Estructura->idestructura;
            $fechasist = self::ObtenerFechaProximAut($objfecha->fecha, $objfecha->fechasist);
            if ($fechasist == NULL) {
                return false;
            }
            
            $estadp = self::VerificarFechaPeriodo(
            $identidad, $objfecha->idsubsistema, $fechasist, $objfecha->idestructurasubsist
            );
            self::estadoEx($estadp);
            if ($this->subsistemaactual == 4) {
                if (!$this->integrator->contabilidad->ExisteCOSinError($fechasist)) {
                    return false;
                }
            }
            if ($this->subsistemaactual == 7) {
                if (!$this->integrator->capitalhumano->NominasContabilizadas()) {
                    return false;
                }
            }

            self::PasarfechaAutomaticaL($objfecha->idfecha);
            return true;
        } catch (ZendExt_Exception $e) {
            throw new ZendExt_Exception('CONF099', $e);
        }
    }

    /**
     * @param $estadp
     * @param $e
     *
     * @throws ZendExt_Exception
     */
    private function estadoEx($estadp)
    {
        if (!$estadp) {
            throw new ZendExt_Exception('CONF139', $e);
            $e.='';
        }
    }

    /**
       * Dado un objeto fecha pasa la fecha automatica si el incremento es de tipo manual.
       * 
       * @param object $objfecha Objeto de tipo fecha
       * @param int $incremento Tipo de incremento dado un valor
       * @return boolean Verdadero en caso de pasar la fecha falso en otro caso
       * @throws @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacción.
       */
    public function PasarfechaAutomaticaL($idfecha, $incremento = 1) 
    {
        try {
            $fecham = new DatFechaconf();
            $fecham = Doctrine::getTable('DatFechaconf')->find($idfecha);
            //echo "---".$fecham->fecha;die;
            list($anno, $mes, $dia) = split("-", $fecham->fecha);
            $fechap = $dia . "-" . $mes . "-" . $anno;
            if ($fechap != date("d-m-Y")) {//echo $fechap."-->";
                $this->conn->beginTransaction();
                if ($fechap != date("d-m-Y")) {
                    $fechadif = $this->of->restaFechas($fechap, date("d-m-Y"));
                } else {
                    $fecpr = $this->of->nextDate($fecham->fechasist, 1);
                    $fechadif = $this->of->restaFechas($fechap, $fecpr);
                }

                $fecham->idfecha = $idfecha;
                if ($incremento != 1) {
                    $fecham->incremento = 2;
                }
                $fechasistema = $this->of->nextDate($fecham->fechasist, $fechadif);

                $fecham->fecha = date("d-m-Y");
                $fecham->fechasist = $fechasistema;
                $version = $fecham->version;
                $fecham->version = $version;
                $fecham->save();
                $this->conn->commit();
            }
        } catch (Doctrine_Exception $ee) {
            $this->conn->rollback();
            throw $ee;
        }
    }
     /**
       * Pasa la fecha de un subsistema donde el tipo de incremento sea manual.
       * 
       * @param int $idsfecha Identificador de fecha
       * @param object $fechaproxima Objeto de tipo fecha  
       * @throws @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacción.
       */
    public function PasarFechaL($idfecha, $fechaproxima) 
    {
        try {
            $fecham = Doctrine::getTable('DatFechaconf')->find($idfecha);
            $fecham->fecha = $fechaproxima;
            $fecham->fechasist = date("d-m-Y");
            $version = $fecham->version;
            $fecham->version = $version;
            $fecham->save();
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF091', $ee);
        }
    }
     /**
       * Forma el Grid de una entidad.
       *
       * @param int $identidad identificador de entidad
       * @param int $limit Cantidad de elementos que desea buscar
       * @param int $start indice de inicio de la busqueda 
       * @return array Retorna un arreglo con la cantidad de fechas y con los elementos
       * @throws @throws ZendExt_Exception $e Excepci&oacute;n de Zend ocurrida durante la busqueda.
       */
    public function FormarArregGrid1($identidad, $limit, $start) 
    {

        try {
            $subsistemas = $this->integrator->datosmaestros->buscarSubsistemasPorEntidad($identidad);

            $resul = array();
            $mensaje = null;
            $cant = 0;
            if (count($subsistemas) > 0) {
                $idestsubs = self::ObtenerIdestructsubsis($subsistemas);
                $estructurasubsistemas = DatFechaconf::Fechas($limit, $start, $idestsubs);
                foreach ($subsistemas as $subsistema) {
                    list($resul, $cant) = self::datosSubsistema($subsistema, $estructurasubsistemas, $resul, $cant);
                }
            } else {
                $mensaje = 'La entidad seleccionada no tiene subsistemas configurados.';
            }

            $resfin = self::resFin($mensaje, $cant, $resul);

            unset($estructurasubsistemas);
            return $resfin;
        } catch (ZendExt_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $subsistema
     * @param $estructurasubsistemas
     * @param $resul
     * @param $cant
     *
     * @return array
     */
    private function datosSubsistema($subsistema, $estructurasubsistemas, $resul, $cant)
    {
        $nomSubsistema = $subsistema->NomSubsistema;
        $bandera = false;
        foreach ($estructurasubsistemas[1] as $estructurasubsistema) {
            if ($subsistema->idestructurasubsist == $estructurasubsistema['idestructurasubsist']) {
                $annadir = array(
                    'fecha'               => $estructurasubsistema['fecha'],
                    'incremento'          => ($estructurasubsistema['incremento'] == 1) ?
                        'Configuraci&oacute;n autom&aacute;tica' : 'Configuraci&oacute;n manual',
                    'idestructurasubsist' => $nomSubsistema['denominacion']
                );
                $resul[] = $annadir;
                $bandera = true;
            }
        }
        if (!$bandera) {
            $cant++;
            $annadir = array(
                'fecha'               => null,
                'incremento'          => '',
                'idestructurasubsist' => $nomSubsistema['denominacion']
            );
            $resul[] = $annadir;
            return array($resul, $cant);
        }
        return array($resul, $cant);
    }

    /**
     * @param $mensaje
     * @param $cant
     * @param $resul
     *
     * @return array
     */
    private function resFin($mensaje, $cant, $resul)
    {
        if ($mensaje == null && $cant > 0) {
            $mensaje = 'Debe configurar la fecha de algunos subsistemas.';
        }
        if ($mensaje == null) {
            $resfin = array('cant' => count($resul), 'datos' => $resul);
            return $resfin;
        } else {
            $resfin = array('cant' => count($resul), 'datos' => $resul, 'mensaje' => $mensaje, 'codMsg' => '1');
            return $resfin;
        }
    }

    /**
       * Modifica un objeto fecha.
       *
       * @param DatFechaconf $objFecha Objeto fecha
       * @return boolean Retorna true si la fecha es modificada falso en otro caso  
       * @throws Exception $e Excepci&oacute;n de doctrine ocurrida durante la transacci&oacute;n.
       */
    public function modificarFecha(DatFechaconf $objFecha) 
    {
        try {
            $versiono = $objFecha->version;
            $version = Doctrine::getTable('DatFechaconf')->find($objFecha->identifier());
            if ($version != $versiono) {
                throw new ZendExt_Exception('CONF153');
            } else {
                $dm = Doctrine_Manager::getInstance();
                $cc = $dm->getCurrentConnection();
                $cc->beginTransaction();
                $objFecha->save();
                $cc->commit();
                return true;
            }
        } catch (Exception $e) {
            return false;
            throw $e;
        }
    }
     /**
       * Pasa la fecha actual a una siguiente
       *
       * @param DatFechaconf $agobjFecha Objeto fecha
       * @param object $fehcaSgte Objeto de tipo de fecha
       * @throws Doctrine_Exception $dex Excepci&oacute;n de doctrine ocurrida durante la transacci&oacute;n.
       */
    public function pasarFechaSgte(DatFechaconf $agObjFecha, $fechaSgte) 
    {
        try {
            $versiono = $agObjFecha->version;
            $version = Doctrine::getTable('DatFechaconf')->find($agObjFecha->identifier())->version;
            if ($version != $versiono) {
                throw new ZendExt_Exception('CONF153');
            } else {
                $agObjFecha->fecha = $fechaSgte;
                $dm = Doctrine_Manager::getInstance();
                $cc = $dm->getCurrentConnection();
                $cc->beginTransaction();
                $agObjFecha->save();
                $cc->commit();
                return true;
            }
        } catch (Doctrine_Exception $dex) {
            throw $dex;
        }
    }
     /**
       * Dias entre 2 fechas
       *
       * @param object $agFechaInicio Objeto de tipo fecha
       * @param object $agFechaFin Objeto de tipo fecha
       * @return int Retorna un entero con la cantidad de dias entre 2 fechas
       * 
       */
    public function diasEntreFechas($agFechaInicio, $agFechaFin) 
    {
        return ((strtotime($agFechaFin) - strtotime($agFechaInicio)) / 86400);
    }

}
