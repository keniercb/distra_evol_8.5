<?php
class FuncionalidadesseguridadcompController extends ZendExt_Controller_Secure {
    function init () {
        parent::init();
    }

    function funcionalidadesseguridadcompAction() {
        $this->render();
    }
	
    public function mostrarfuncionalidadesseguridadAction(){
        $register = Zend_Registry::getInstance();
        $certifcate = $register->session->certificado;
        $idestructura = $this->global->Estructura->idestructura;
        $src=$this->_request->getPost('src');
        $idnodo = $this->_request->getPost('node');
        $dir_apps = Zend_Registry::getInstance()->config->dir_aplication;
        if($idnodo == -1){
            $systemsArray = $this->integrator->seguridad->ObtenerSistemas($certifcate,$idestructura);
            foreach ($systemsArray as $key => &$v) {
                $v['text'] = $v['titulo'];
            }
        }    
        else{
            $systemsArray = $this->integrator->seguridad->ObtenerModulosFuncionalidades($certifcate,$idnodo,$idestructura);
            if ($src){
                if ($systemsArray[0]['leaf']){
                   foreach ($systemsArray as $key => &$v) {
                     $cadena= trim(str_replace ('../',' ',$v['referencia']));                      
                     $array=explode('/index.php/',$cadena);      
                     $array2=explode('/',$array[1]);
                     $namecontroller=ucfirst($array2[0]).'Controller';
                     $directorio=$dir_apps.$array[0].'/controllers/'.$namecontroller.'.php';                     
                     $v['children'][0]['id'] = $directorio;
                     $v['referencia']= $cadena;
                     $v['ubicacion']= $directorio;
                     $v['children'][0]['text']=ucfirst($array2[0]).'Controller';                     
                     $v['children'][0]['children']=self::getMethodsInformation($directorio,$namecontroller,$cadena,$v['idfuncionalidad']);;                     
                     $v['leaf']=false;
                   }  
                }
            }
           
        }    
        echo json_encode($systemsArray);
    }
  private function getMethodsInformation($directorio,$namecontroller,$cadena,$idfuncionalidad){
       include_once ($directorio);            
       $methods = get_class_methods($namecontroller);
       //Cable: 39 es la cantidd de metodos que herada un controlador de las calse del Framework (Seguridad no tiene implementado un servicio que dado una funcionalidad y un dominio, me de las Acciones)
       $nearraymethods=array_slice($methods, 0,count($methods)-39);
       $array=array();     
       foreach ($nearraymethods as $key => $function) {
           $array[$key]['id']=$function;
           $array[$key]['idfuncionalidad']=$idfuncionalidad;
           $accion=explode('Action', $function);
           $array[$key]['referencia']= substr($cadena,0,strrpos($cadena,'/')).'/'.$accion[0]; 
           $array[$key]['text']=$function;
           $array[$key]['leaf']=true;           
       }    
       return $array;
  }	
}
?>
