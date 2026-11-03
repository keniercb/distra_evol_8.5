<?php

/**
 * Controlador para gestionar las plantillas nominales
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Configuración.
 * @category Clase controladora.
 * @uses GestplantillanominalModel
 * @copyright UCID
 * @version 1.0
 */
class GestplantillanominalController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }

    /**
     * Acción utilizada para mostrar la vista.
     */
    public function gestplantillanominalAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de las plantillas nominales.
     */
    public function obtenerListadoPlantillasNominalesAction() {
	    $textobuscar = $this->_getParam('textoabuscar');
        $identidad = $this->_getParam('identidad');

        //Creando el modelo de negocio de gestión de plantillas nominales.
        $modeloNegocioPlantillaN = new GestPlantillaNominalModel();

        //Obteniendo el listado de plantillas.
        $arrPlantilla = $modeloNegocioPlantillaN->obtenerListadoPlantillaNominal(
            $identidad,$textobuscar
        );
        foreach ($arrPlantilla as $ip => $rplant){
            if($rplant['idcentrocosto']){
                $sqlDenomCentrosdeCosto = "select (codigocentrogrupo ||'_'||descripcioncentrogrupo)  as descripcioncentrogrupo , idpadre
                                           from mod_contabilidadcosto.nom_centrocosto
			                                where idcentrogrupo = ?;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $arrdenomcentroscosto = $conn->fetchAll($sqlDenomCentrosdeCosto, array($rplant['idcentrocosto']));
                $idpadre = $arrdenomcentroscosto[0]['idpadre'];
                if($rplant['idcentrocosto'] == $idpadre){
                    $arrPlantilla[$ip]['centrocosto'] = $arrdenomcentroscosto[0]['descripcioncentrogrupo'];
                }else{
                    $sqlDenomCentrosdeCosto = "select centrocosto.descripcioncentrogrupo
                              from mod_contabilidadcosto.nom_centrocosto centrocosto
                              where centrocosto.idcentrogrupo = ?;";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $denomcentroscostopadre = $conn->fetchOne($sqlDenomCentrosdeCosto, array($idpadre));
                    $arrPlantilla[$ip]['centrocosto'] = $arrdenomcentroscosto[0]['descripcioncentrogrupo'].'.'.$denomcentroscostopadre;
                }

            }
        }

        //Actualizando automaticamente los Cargos nuevos en las plantillas nominales
        $actcargos = $this->actualizarCargosAutomaticamenteEstructura($identidad);
        //Si termino de actualizar los cargos
        if($actcargos == 1){
            //Imprimiendo el listado de plantillas nominales.
            echo Zend_Json::encode(array('datos' => $arrPlantilla, 'cantidad' => count($arrPlantilla)));
        }
    }

	/**
     * Accion para adicionar una plantilla nominal.
     */
    public function adicionarPlantillaNominalAction() {

        //Creando el modelo de negocio de gestión de plantillas nominales.
        $modeloNegocioPlantillaN = new GestPlantillaNominalModel();

        //Insertando los datos de la plantilla nominal.
        $existe = $modeloNegocioPlantillaN->adicionarPlantillaNominal(
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion'),
            $this->_getParam('identidad'),
            $this->_getParam('codigo'),
			    // $this->_getParam('area'),
            1,
            $this->_getParam('orden'),
            $this->_getParam('idcentrocosto')
        );
        if($existe!='existe'){
        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
		}else{
		//Devolviendo una notificación de que todo ocurrió fallido.
        echo "{'codigo':'3'}";
		}
    }

    /**
     * Accion para modificar una plantilla nominal.
     */
    public function modificarPlantillaNominalAction() {

        //Creando el modelo de negocio de gestión de plantillas nominales.
        $modeloNegocioPlantillaN = new GestPlantillaNominalModel();

        //Modificando los datos de la plantilla nominal.
        $modeloNegocioPlantillaN->modificarPlantillaNominal(
            $this->_getParam('idplantilla'),
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion'),
            $this->_getParam('codigo'),
            $this->_getParam('area'),
            $this->_getParam('orden'),
            $this->_getParam('idcentrocosto')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion para eliminar una plantilla nominal.
     */
    public function eliminarPlantillaNominalAction() {

        //Creando el modelo de negocio de gestión de plantillas nominales.
        $modeloNegocioPlantillaN = new GestPlantillaNominalModel();


        //Eliminando la plantilla nominal.
        $bool = $modeloNegocioPlantillaN->eliminarPlantillaNominal(
            $this->_getParam('idplantilla')
        );
        if($bool == 2){
			echo "{'codigo':'3'}";
		}else{
			//Devolviendo una notificación de que todo ocurrió correctamente
			echo "{'codigo':'1'}";
	    }
    }

    /**
     * Accion utilizada para listar la estructura de plantilla nominal.
     */
    public function obtenerEstructuraPlantillaNominalAction() {

        //Creando el modelo de negocio de gestión de cargos de plantillas nominales.
        $modeloNegocioCargosP = new GestPlantillaNominalCargoModel();

        //Obteniendo el listado de plantillas.
        $arrEstruc = $modeloNegocioCargosP->obtenerEstructuraPlantillaNominal(
            $this->_getParam('idplantilla'), false
        );

        //Imprimiendo el listado de plantillas nominales.
        echo Zend_Json::encode($arrEstruc);
    }

    /**
     * Accion utilizada para listar la estructura restante.
     */
    public function obtenerEstructuraRestanteAction() {
        //Creando el modelo de negocio de gestión de cargos de plantillas nominales.
        $modeloNegocioCargosP = new GestPlantillaNominalCargoModel();

        //Obteniendo el listado de estructuras restantes.
        $arrEstruc = $modeloNegocioCargosP->obtenerEstructuraRestantes(
            $this->_getParam('identidad'),
            $this->_getParam('node')
        );

        //Imprimiendo el listado de estructuras restantes.
        echo Zend_Json::encode($arrEstruc);

    }

    /**
     * Accion utilizada para listar la estructura insertadas.
     */
    public function obtenerEstructuraInsertadasAction() {

       //Creando el modelo de negocio de gestión de cargos de plantillas nominales.
        $modeloNegocioCargosP = new GestPlantillaNominalCargoModel();

        //Obteniendo el listado de estructuras insertadas.
        $arrEstruc = $modeloNegocioCargosP->obtenerEstructuraPlantillaNominal($this->_getParam('idplantilla'), true);

        //Imprimiendo el listado de estructuras insertadas.
        echo Zend_Json::encode($arrEstruc);
    }



    /**
     * Accion para adicionar una estructura de plantilla nominal.
     */
    public function adicionarEstructuraPlantillaNominalAction() {

        //Creando el modelo de negocio de gestión de cargos de plantillas nominales.
        $modeloNegocioCargosP = new GestPlantillaNominalCargoModel();

        //Insertando los datos de la estructura plantilla nominal.
        $modeloNegocioCargosP->adicionarEstructuraPlantillaNominal(
            $this->_getParam('idplantilla'),
            $this->_getParam('identidad'),
           Zend_Json::decode(stripslashes($this->_getParam('array')))
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }


    /**
     * Accion para eliminar una estructura de plantilla nominal.
     */
    public function eliminarEstructuraPlantillaNominalAction() {
        //Creando el modelo de negocio de gestión de cargos de plantillas nominales.
        $modeloNegocioCargosP = new GestPlantillaNominalCargoModel();

        //Eliminando los datos de la estructura plantilla nominal.
        $modeloNegocioCargosP->eliminarEstructuraPlantillaNominal(
            $this->_getParam('idplantilla'),
           Zend_Json::decode(stripslashes($this->_getParam('array')))
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }


	/**
     * Accion utilizada para cargar las areas.
     */
    public function obtenerAreaAction() {

		$idestructura = $this->_getParam('idestructura');

       //Creando el modelo de negocio de nomenclador area.
        $modeloArea = new NomAreasModel();

        //Obteniendo el listado de areas.
        $arrArea = $modeloArea->obtenerAreas($idestructura);

        //Imprimiendo el listado de areas.
        echo Zend_Json::encode(array('datos'=>$arrArea));
    }

    public  function obtenerCentrosCostoAction(){
        $idestructura = $this->_getParam('idestructura');
        //Maximo del nivel de los centros de costo para pedir solo las hojas
        $sqlMaxNivelCentrosdeCosto = "select max(centrocosto.nivel) as maximo
                              from mod_contabilidadcosto.nom_centrocosto centrocosto
                              left join mod_contabilidadcosto.dat_centro_grupo_entidad dcce on (dcce.idcentrogrupo = centrocosto.idcentrogrupo)
                              where (centrocosto.idestructuracomun = ?) or (dcce.idestructuracomun = ?);";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arrmaxnivel = $conn->fetchOne($sqlMaxNivelCentrosdeCosto, array($idestructura, $idestructura));
        $sqlCentrosdeCosto = "select centrocosto.idcentrogrupo, centrocosto.idpadre,(centrocosto.codigocentrogrupo ||'_'||centrocosto.descripcioncentrogrupo)  as denominacion, centrocosto.nivel
                              from mod_contabilidadcosto.nom_centrocosto centrocosto
							  left join mod_contabilidadcosto.dat_centro_grupo_entidad ge on (centrocosto.idcentrogrupo = ge.idcentrogrupo)
                              where (ge.idestructuracomun = {$idestructura} OR centrocosto.idestructuracomun = {$idestructura}) ;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arrcentroscosto = $conn->fetchAll($sqlCentrosdeCosto);
        $arrcc = array();
        //Eliminando a los padres del arreglo
        for($i = 0; $i < count($arrcentroscosto); $i++){
            $idpadre = $arrcentroscosto[$i]['idpadre'];
            for($j = $i+1; $j < count($arrcentroscosto); $j++){
                $idcentrocosto = $arrcentroscosto[$j]['idcentrogrupo'];
                if($idcentrocosto == $idpadre){
                    unset($arrcentroscosto[$j]);
                    $arrcentroscosto = array_values($arrcentroscosto);
                }
            }
        }
        foreach ($arrcentroscosto as $icc => $cc){
            $arrcc[$icc]['idcentrocosto'] = $cc['idcentrogrupo'];
            if($cc['idcentrogrupo'] == $cc['idpadre']){
                $arrcc[$icc]['centrocosto'] = $cc['denominacion'];
            }else{
                //Si tiene padre se le concatena la denominacion del padre
                $idpadre = $cc['idpadre'];
                $sqlDenomCentrosdeCosto = "select centrocosto.descripcioncentrogrupo
                              from mod_contabilidadcosto.nom_centrocosto centrocosto
                              where centrocosto.idcentrogrupo = ?;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $denomcentroscostopadre = $conn->fetchOne($sqlDenomCentrosdeCosto, array($idpadre));
                $arrcc[$icc]['centrocosto'] = $cc['denominacion'].'.'.$denomcentroscostopadre;
            }
        }
        echo Zend_Json::encode(array('datos'=>$arrcc, 'cantidad'=>count($arrcc)));
    }

    public  function sincronizarPlantillasNominalesAction(){
        //Estructuras a sincronizar
        $identidad = Zend_Json::decode(stripslashes($this->_getParam('identidad')));
        $arrayestructuras = Zend_Json::decode(stripslashes($this->_getParam('arrayestructuras')));
        $objConfPlantillaNominal = new ConfPlantillaNominal();
        $orden = 1;
        //orden maximo
        $sqlOrden = "select max (orden)
                              from mod_nomina.conf_plantillanominal
                              where identidad = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $ordenmaximo = $conn->fetchOne($sqlOrden, array($identidad));
        $ordenmaximo += $orden;
        foreach ($arrayestructuras as $idestructura){
            //Datos de la estructura
            $datosest = $this->integrator->metadatos->DameEstructura($idestructura);
            //Validando que esta estructura no se sincronice doble
            //Si esta estructura no esta sincronizada
            $exiteplantillaestructurasincronizada = $objConfPlantillaNominal->verifyExistPlantillaxIdEstructuraSincroniza($idestructura);
            if(!$exiteplantillaestructurasincronizada){
                $exiteplantillaxdenonidentidad = $objConfPlantillaNominal->verifyExistPlantilla($identidad,$datosest[0]->denominacion);
                if(!$exiteplantillaxdenonidentidad){
                    //Adicionando datos de las plantillas nominales
                    $objGestPlantillaNominal = new ConfPlantillaNominal();
                    $objGestPlantillaNominal->denominacion = $datosest[0]->denominacion;
                    $objGestPlantillaNominal->identidad = $identidad;
                    $objGestPlantillaNominal->orden = $ordenmaximo;
                    $objGestPlantillaNominal->fechainicio = date("Y-m-d");
                    $objGestPlantillaNominal->idestructurasincroniza = $idestructura;
                    $objGestPlantillaNominal->save();
                    $ordenmaximo++;
                    //Arreglo de cargos
                    $arrcargosestructura = $this->integrator->metadatos->obtenerCargosEstructura($idestructura);
                    foreach ($arrcargosestructura as $rcargo){
                        $idcargo = $rcargo['idcargo'];
                        //Existe el cargo en otra plantilla nominal
                        $sqlExisteCargo = "select count (idcargo)
                              from mod_nomina.conf_plantillanominalcargo
                              where idcargo = ?;";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $existecargo = $conn->fetchOne($sqlExisteCargo, array($idcargo));
                        //Si ese cargo no existe en ninguna plantilla nominal
                        if($existecargo == 0){
                            $objConfPlantillaNominalCargo = new ConfPlantillaNominalCargo();
                            $objConfPlantillaNominalCargo->idplantillanominal = $objGestPlantillaNominal->idplantillanominal;
                            $objConfPlantillaNominalCargo->idcargo = $idcargo;
                            $objConfPlantillaNominalCargo->save();
                        }
                    }
                }
            }

        }
        echo json_encode('sync');
    }

    public function actualizarCargosAutomaticamenteEstructura($identidad){
        $objConfPlantillaNominal = new ConfPlantillaNominal();
        $objConfPlantillaNominalCargo = new ConfPlantillaNominalCargo();
        $ioc = ZendExt_IoC::getInstance();
        //Obtener Array de Plantillas Nominales con idestructurasincronizada
        $arrayplantillas = $objConfPlantillaNominal->obtenerListadoPlantillasNominalesSincronizadas($identidad);
        if(count($arrayplantillas > 0)){
            foreach($arrayplantillas as $rp){
                $idplantillanominal = $rp['idplantillanominal'];
                $idestructurasincroniza = $rp['idestructurasincroniza'];
                //Cargos subordinados
                $arrCargosPorIdEstructura = $ioc->metadatos->obtenerCargosEstructura($idestructurasincroniza);
                if(count($arrCargosPorIdEstructura > 0)){
                    //Recorriendo los cargos subordinados
                    foreach($arrCargosPorIdEstructura as $rce){
                        $idcargo = $rce['idcargo'];
                        //Si el Cargo no esta asociado a ninguna plantilla nominal se inserta
                        $cantidadcargosp = $objConfPlantillaNominalCargo->obtenerCantidadCargoXPlantillaNominal($idcargo);
                        if($cantidadcargosp == 0){
                            $objConfPlantillaNominalCargo = new ConfPlantillaNominalCargo();
                            $objConfPlantillaNominalCargo->idplantillanominal = $idplantillanominal;
                            $objConfPlantillaNominalCargo->idcargo = $idcargo;
                            $objConfPlantillaNominalCargo->save();
                        }
                    }
                }
            }
        }
        return 1;
    }

    public function actualizarOrdenAction(){
        $arrayidplantillanominal = Zend_Json::decode(stripslashes($this->_getParam('arrayidplantillanominal')));
        $arrayorden = Zend_Json::decode(stripslashes($this->_getParam('arrayorden')));
        //Recorriendo los idplantillas nominales para actualizar el orden
        foreach($arrayidplantillanominal as $cont => $idplantillanominal){
            $objConfPlantillaNominal = Doctrine::getTable('ConfPlantillaNominal')->find($idplantillanominal);
            $objConfPlantillaNominal->orden = $arrayorden[$cont];
            $objConfPlantillaNominal->save();
        }
        echo json_encode('COD-1');
    }

}
