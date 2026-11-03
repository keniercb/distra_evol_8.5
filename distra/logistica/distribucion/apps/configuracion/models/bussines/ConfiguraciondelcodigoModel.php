<?php

class ConfiguraciondelcodigoModel extends BaseModel
{

 private $idestructuracomun;
 private $configuracionHelper;
 private $idejercicio;
 private $fechainicio;
 private $fechafin;

 public function setUp()
 {
  parent::ZendExt_Model();
 }

 public function __construct()
 {
  parent::__construct();
  $this->configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
  $this->idestructuracomun = $this->global->Estructura->idestructura;

  $this->idejercicio = $this->configuracionHelper->getEjercicioActualSubsistema(
   $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_INV
  );
  $ejercicio = $this->integrator->datosmaestros->obtenerEjercicio($this->idejercicio, $this->idestructuracomun);
  $this->fechainicio = "'" . $ejercicio[0]->inicio . "'";
  $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->idestructuracomun, 10);
  $this->fechafin = "'" . $fecha->fecha . "'";
 }

 public function codigodeoperaciones($params){
    $start = ($params['start']) ? $params['start'] : 0;
    $limit = ($params['limit']) ? $params['limit'] : 30;
  
   $estructura = $this->global->Estructura->idestructura;
        if ($post['idestructura']) {
            $estructura = $post['idestructura'];
        }
      
    $sql =  "select*, count(*) over() as cantidad
    from mod_datosmaestros.f_codigodelasoperaciones($estructura)
    LIMIT $limit
    OFFSET $start 
    ";
   
   
    $conn = Zend_Registry::get('conexion');
    $result = $conn->fetchAll($sql);
    return array('datos' => $result, 'cantidad' => $result[0] ? $result[0]['cantidad'] : 0); 

}
 public function cargarcodigo($params)
    {
        $estructura = $this->global->Estructura->idestructura;
        if ($post['idestructura']) {
            $estructura = $post['idestructura'];
        }
        $sql =  "select codigooperacion
        from mod_datosmaestros.f_codigodelasoperaciones($estructura) where codigooperacion IS NOT NULL
        ";
        
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll($sql);
        return array('datos' => $result);
    }
    public function actualizarcodigo($params)
    {
        $idnomoperaciones = $params['idnomoperaciones'];
        $codigooperacion = $params['codigooperacion'];
       
          $sql = "
        UPDATE 
        mod_datosmaestros.nom_operacion
          SET
          codigooperacion = '{$codigooperacion}'
          WHERE 
          idnomoperaciones = {$idnomoperaciones}
        ";
        //print_r($codigooperacion);die;
          $conn = Zend_Registry::get('conexion');
          $query = $conn->prepare($sql);
          $query->execute();
    }
    public function eliminarcodigo($params)
    {
      
        $idnomoperaciones = $params['idnomoperaciones'];
        $codigooperacion = $params['codigooperacion'];
        $sql = " UPDATE 
        mod_datosmaestros.nom_operacion
          SET
          codigooperacion = null
          WHERE 
          idnomoperaciones = {$idnomoperaciones}
        ";
        $conn = Zend_Registry::get('conexion');
        $query = $conn->prepare($sql);
        $query->execute();
    }

 

 

}
