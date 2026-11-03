<?php
/**
 * Controlador para cargar los nomencladores de asistencia.
**/
class NomencladoresasistenciaController extends ZendExt_Controller_Secure {

	/**
     * Inicializar los atributos de la clase.
     */
	public function init(){	
		parent::init();
	}

	/**
     * Acción utilizada para mostrar la vista de los nomencladores.
     */
	public function nomencladoresasistenciaAction(){
		//Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;
        //Mostrando la vista.
	   	$this->render();
	}

	/**
     * Función utilizada para obtener la url del directorio actual.
     */
	public function getDirUrl(){
		//Direccion de la carpeta de publicacion		
		$dir_www = $_SERVER['DOCUMENT_ROOT'];
		$dir_file = $_SERVER['SCRIPT_FILENAME'];

		//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
		$dir_rel_mt = '/';

		//Direccion absoluta del marco de trabajo
                $dir_abs_www = str_replace("//", "/", str_replace('web','',$dir_www). $dir_rel_mt);
                $dir_abs_file = str_replace("//", "/", str_replace('index.php','',$dir_file). $dir_rel_mt);
		//$dir_abs_file = str_replace('//','/', dirname($dir_file . '..') . '/' . $dir_rel_mt);
		$dir_root=str_replace($dir_www, "", $dir_abs_file);

		//Devolviendo la url.
		//return "/".$dir_root;
		return $dir_root;
	}
	
	/*function getSrcAction(){
		$dir_root=$this->getDirUrl().'index.php/';
		$result = array('dato'=> $dir_root);
		echo(json_encode($result));	
	}*/

	/**
     * Acción utilizada para devolver el árbol de nomencladores.
     */
    public function cargarArbolNomencladoresAction(){
    	//Creando el modelo de nomencladores.
        $modeloNomencladores = new NomNomencladoresModel();

        //Obteniendo el árbol de nomencladores.
        $arrArbol = $modeloNomencladores->obtenerArbolNomencladores(
            $this->getDirUrl()
        );

        //Imprimiendo el árbol de nomencladores.
        echo Zend_Json::encode($arrArbol);
	}	
}	