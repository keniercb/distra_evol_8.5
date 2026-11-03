<?php

//FIXME I AM A PARCHE
class ZendExt_Rest_Controller extends ZendExt_Controller_Secure
{
    private function parserMethod()
    {        
        $raw  = '';
        $httpContent = fopen('php://input', 'r');
        while ($kb = fread($httpContent, 1024)) {
            $raw .= $kb;
        }
        fclose($httpContent);
        $params = array();
        parse_str($raw, $params);
        
        $datas = isset($params['data']) ? $params['data'] : $raw;
        if(!($data = json_decode(stripslashes($datas)))){
			$data = json_decode($datas);
		}
		
		$this->_request->setParam('data', $data);
               
        if($this->_request->isGet()){
            return ($this->_request->id) ? "show" : "index";
        } elseif ($this->_request->isPost()) {
            return 'create';
        } elseif ($this->_request->isPut()) {
            return 'update';
        } elseif ($this->_request->isDelete()) {
            return 'destroy';
        } else {
            return $this->_request->getMethod();
        }        
    }

    public function restMapperAction()
    {
		$modulesDir = $this->initModules();
		$this->initPlugins($modulesDir);
        $this->initMsg();
        if ($this->_request->restController)
        {    
           
            $controllerName = ucfirst($this->_request->restController) . 'Controller';
            $controller = new $controllerName($this->_request, $this->_response);
            $method = $this->parserMethod() . "Action";
            $controller->$method();
        }
        

    }
    public function initModules(){
		if($this->_request->modulename)
		{
			
			$modulesDir = 'modules';            
            $subsystemParts = explode(DIRECTORY_SEPARATOR, substr($_SERVER['SCRIPT_NAME'], 1));
            unset($subsystemParts[count($subsystemParts)-1]);    
            $subsystem = implode(DIRECTORY_SEPARATOR, $subsystemParts);  
                      
            $rootDirParts = explode(DIRECTORY_SEPARATOR, substr($_SERVER['DOCUMENT_ROOT'], 1));
            unset($rootDirParts[count($rootDirParts)-1]);
            $rootDir = DIRECTORY_SEPARATOR . implode(DIRECTORY_SEPARATOR, $rootDirParts);
            
            $currentModuleDir = $rootDir . DIRECTORY_SEPARATOR . 'apps' .  DIRECTORY_SEPARATOR 
										 . $subsystem . DIRECTORY_SEPARATOR . $modulesDir . DIRECTORY_SEPARATOR 
										 . $this->_request->modulename;
            $newIncludePath = PATH_SEPARATOR . $currentModuleDir . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'bussines'
							 . PATH_SEPARATOR . $currentModuleDir . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'domain'	
							 . PATH_SEPARATOR . $currentModuleDir . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'domain'	. DIRECTORY_SEPARATOR . 'generated'
							 . PATH_SEPARATOR . $currentModuleDir . DIRECTORY_SEPARATOR . 'controllers' 
							 . PATH_SEPARATOR . $currentModuleDir . DIRECTORY_SEPARATOR . 'plugins'            
							 . PATH_SEPARATOR . $currentModuleDir . DIRECTORY_SEPARATOR . 'services';            
            
            set_include_path(get_include_path()	. $newIncludePath);
            return $currentModuleDir;
		}
	}
    
    public function initPlugins($moduleDir)
    { 
		         $dir = $moduleDir.DIRECTORY_SEPARATOR.'plugins/plugins-config.json';		         
		         if(file_exists($dir))
		         {		             
					if(!is_readable($dir))
						throw new Exception('No se puede leer');
					$moduleConfig =  Zend_Json::decode(file_get_contents($dir));
					$plugins = $moduleConfig["plugins"];
					foreach($plugins as $plug)
					{                   
						if($plug["enabled"]){                   
							$plugClass = $plug['name'];
							 //print_r($plugClass);
							$plugObject = new $plugClass();
							$plugObject ->initPlugin();                    
						}
					}
				}	
	}
	public function initMsg(){
		if($this->_request->msg){
			$msg = $this->_request-> msg;
			$params = array();
			$params["data"] = $this->_request->params ? $this->_request->params :null;
			$params["request"] = $this->_request;
			ZendExt_Util_MsgBus::getInstance()->sendMsg($msg,$params);     
		}
	}

}
