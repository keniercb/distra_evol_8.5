<?php

/**
 * Controlador de historial
 *
 * @author    Osleidy Quiala Fernáandez
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpbasereglamentariaController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
        $this->setearIncludePath();
    }

    public function setearIncludePath()
    {
      $dir = split("apps/", __FILE__);
      //apps/planificacion/pdo/plan
      $marco = strstr(__FILE__, "opt/");
      $dir_abs_mt = ($marco) ? $dir[0] . 'apps/' . $dir[1] : $dir[0];
      $include_path =
        PATH_SEPARATOR . $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR . 'pdo' . DIRECTORY_SEPARATOR . 'plan' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'domain' . DIRECTORY_SEPARATOR . 'generated'
        . PATH_SEPARATOR . $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR . 'pdo' . DIRECTORY_SEPARATOR . 'plan' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'domain'
        . PATH_SEPARATOR . $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR . 'pdo' . DIRECTORY_SEPARATOR . 'plan' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'bussines';
      set_include_path(get_include_path() . $include_path);
    }

    /**
     * Accion para mostrar la vista historial.phtml
     */
    function cmpbasereglamentariaAction()
    {
        $this->render();
    }

    /**
     * Accion para listar Actividades
     */
    function CargarbasesreglamentariasAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros=new stdClass();
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->start = ($this->_request->getPost('start'))
            ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit'))
            ? $this->_request->getPost('limit') : 1000;

        $objbaseModel=new CmpbasereglamentariaModel();
        $resultado=$objbaseModel->cargarbasereglamentarias($parametros);

      echo json_encode(
        array('success' => true, 'total' => (count($resultado)==0)?0:$resultado[0]['totalelementos'],
              'campos' => $resultado)
      );
    }

    public function pathHome(){
      $dir_www = $_SERVER ['DOCUMENT_ROOT'];
      $dir_rel_mt = '/';
      $dir_abs_mt = str_replace('//', '/', dirname($dir_www . '..') . '/' . $dir_rel_mt);

      $HOME = $dir_abs_mt . 'web' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR .'pdo' . DIRECTORY_SEPARATOR
        .'plan' . DIRECTORY_SEPARATOR .'resources' . DIRECTORY_SEPARATOR .'basereglamentaria';


      $HOME=str_replace('/', DIRECTORY_SEPARATOR, str_replace('\\', DIRECTORY_SEPARATOR, $HOME));
      return $HOME;
    }

    /**
     * Accion para listar Actividades
     */
    function SalvarbasesreglamentariasAction()
    {
      ini_set("max_execution_time", 3600); //3600 1hora
      $parametros=new stdClass();
      $parametros->idautor = $this->global->Perfil->idusuario;

      $parametros->denominacion = ($this->_request->getPost('denominacion'));

      $parametros->fechacreacion = date("Y-m-d H:i:s");

      $parametros->nombrearchivo = $_FILES['file']['name'];

      $HOME=self::pathHome();

      ini_set('upload_max_filesize', '5000000M');
      ini_set('post_max_size', '5000000M');
      chmod($HOME, 0777);

      $objDatBaseReglamentaria=new DatBaseReglamentaria();

      if(move_uploaded_file($_FILES['file']['tmp_name'], $HOME.DIRECTORY_SEPARATOR.$_FILES['file']['name'])){
        try{
          $cant_exite=$objDatBaseReglamentaria->guardar($parametros);
          if($cant_exite>0){
            $mensaje=3;
          }else{
            $mensaje=1;
          }
        }catch (Exception $e){
//          print_r($e->getMessage());die;
          $mensaje=2;
        }
      }
      else{
        $mensaje=2;
      }

      echo json_encode(
        array('mensaje' => $mensaje)
      );
    }

  function EliminarbasesreglamentariasAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $parametros=new stdClass();
    $parametros->usuario = $this->global->Perfil->idusuario;
    $parametros->idselementos = json_decode(stripslashes($this->_request->getPost('idselementos')));
    try{
      $objDatBaseReglamentaria=new DatBaseReglamentaria();
      $select_file=$objDatBaseReglamentaria->eliminar($parametros);

      $HOME=self::pathHome();

      foreach ($select_file as $value){
              if(file_exists( $HOME.DIRECTORY_SEPARATOR.$value['nombrearchivo']))
                 unlink($HOME.DIRECTORY_SEPARATOR.$value['nombrearchivo']);
      }

      echo json_encode(array('mensaje' => 1));
    }catch (Exception $exception){
//      print_r($exception->getMessage());die;
      echo json_encode(array('mensaje' => 2));
    }

  }

  function DescargarbasesreglamentariasAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $parametros=new stdClass();
    $parametros->usuario = $this->global->Perfil->idusuario;
    $parametros->idselementos = json_decode(stripslashes($this->_request->getPost('idselementos')));
    try{
      $objDatBaseReglamentaria=new DatBaseReglamentaria();
      $select_file=$objDatBaseReglamentaria->nombreArchivos($parametros);

      $HOME=self::pathHome().DIRECTORY_SEPARATOR;

      array_map('unlink', glob("$HOME*.zip"));

      $name_zip="BasesReglamentarias".date("Y_m_d_H_i_s").".zip";
//      $name_zip=str_replace(" ", "", str_replace("-", "", str_replace(":", "", $name_zip)));
      $zip=new ZipArchive;
      $abrio=false;
      if($zip->open($HOME.$name_zip, ZipArchive::CREATE)===true){
        $abrio=true;
      }
      foreach ($select_file as $value){
        if(file_exists( $HOME.$value['nombrearchivo'])){
          if($abrio){
              $zip->addFile($HOME.$value['nombrearchivo'], $value['nombrearchivo']);
          }
        }
      }

      $zip->close();
      echo json_encode(array('archivo' => $name_zip));
    }catch (Exception $exception){
      echo json_encode(array('archivo' => ""));
    }

  }




}
