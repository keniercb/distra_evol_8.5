<?php

class ZendExt_Metadata_Models_TablaModel extends ZendExt_Model
{

    private $_manager;
    private $_campo_model;
    private $_relation_model;
    private $_tabla_domain;
    private $_campo_domain;
    private $_module;

    public function __construct()
    {
        parent :: ZendExt_Model();
        $this->_manager = new ZendExt_Metadata_Sql_Manager();
        $this->_campo_model = new ZendExt_Metadata_Models_CampoModel();
        $this->_relation_model = new ZendExt_Metadata_Models_RelacionModel();
        $this->_tabla_domain = new DatTabla();
        $this->_campo_domain = new DatCampo();
        $doctrineManager = Doctrine_Manager::getInstance();
        $this->_module = $doctrineManager->getConnectionName($this->conn);


    }

    public function cargarTablas($limit, $start)
    {
        $data = new stdClass();
        $data->total = $this->_tabla_domain->contarTablas();
        $data->data = $this->_tabla_domain->cargarTablas($limit, $start);
        return $data;
    }

    public function cargarcmbTablas()
    {
        // $data->total = $this->_tabla_domain->contarTablas();
        $data = new stdClass();
        $data->data = $this->_tabla_domain->cargarcmbTablas();
        return $data;
    }

    public function buscarEnTablas($query, $limit, $start)
    {
        return $this->_tabla_domain->buscarEnTablas($query, $limit, $start);
    }

    public function cargarNomencladores($limit = '', $start = '', $denomTabla = '')
    {
        $this->_manager->setCurrentConnection('xmetacomponent');
        $data = $this->_tabla_domain->cargarNomencladores($limit, $start, $denomTabla);
        // $data->total = $this->_tabla_domain -> contarTablas ('t.importada != 1 AND t.idprefijo = 2');
        $this->_manager->setCurrentConnection($this->_module);
        return $data;
    }

    public function cargarTiposCompuestos()
    {
        $query = Doctrine_Query::create();
        return $query->select('denominacion')
            ->from('NomTipoComponenteCompuesto')
            ->execute()
            ->toArray(true);
    }

    public function cargarPrefijos()
    {
        return $this->_tabla_domain->cargarPrefijos();
    }

    public function eliminarTabla($tId)
    {
        $this->_manager->setCurrentConnection('xmetacomponent');
        //Obtengo la tabla que deseo eliminar
        $tabla = Doctrine::getTable('DatTabla')->find($tId);
        $tabla->NomPrefijo;
        //Valido si la tabla en efecto se puede eliminar.
        //Para ello hay q tener en cuenta que si tiene una relacion con otra tabla
        //Donde ella exporte una llave foranea y tiene datos la otra tabla, no se puede eliminar
        //Otras validaciones por el estilo
        //Si se puede eliminar correctamente.
        //Obtengo los campos de la tabla a eliminar

        $campos = $tabla->DatCampo;

        foreach ($campos as $campo) {
            $this->_campo_model->eliminarCampo($campo->idcampo, true);
        }
        $tabla->delete();
        if ($tabla->importada != 1) {
            $conn = $this->_manager->getConnection('metadataDropTable', false);
            $this->_manager->setCurrentConnection('metadataDropTable');
            if ($tabla->arbol) {
                $this->_manager->eliminarFuncsArbol($tabla);
            }

            $this->_manager->eliminarTabla($tabla);

            $var = explode('_', $tabla->tabla);
            $result = '';
            for ($i = 1; $i < count($var); $i++) {
                $result .= $var[$i] . '_';
            }
            $nombre_seq = implode('_', array('sec', $result)) . 'seq';

            $this->_manager->eliminarSecuencia("{$tabla->esquema}.{$nombre_seq}");
            $conn->close();
        }
        //Elimino recursivamente todas las tablas que se relacionan con la actual.        
        /* $relacionadas = $this->_tabla_domain->obtenerTablasDestinoDe($tId);
          foreach($relacionadas as $idTabla)
          $this->eliminarTabla($idTabla['idtabla']); */
        $this->_manager->setCurrentConnection($this->_module);
        return true;
    }

    function cargarArbolEsquemas($nodo)
    {
        return ($nodo != '0') ? $this->_manager->cargarTablasEnArbol($nodo) : $this->_manager->cargarEsquemasEnArbol();
    }

    public function adicionarTabla($esquema, $tabla, $arbol, $idprefijo, $alias = '', $values = array())
    {

        $this->_manager->setCurrentConnection('xmetacomponent');
        $prefijo = array();
        if ($idprefijo != null) {
            $prefijo = Doctrine::getTable('NomPrefijo')->find($idprefijo);
            $tabla = $prefijo['prefijo'] . '_' . $tabla;
        }


        //$table = ((substr($tabla, 0, 4)) != 'nom_' || (substr($tabla, 0, 4)) != 'dat_'
        //|| (substr($tabla, 0, 4)) != 'his_') ? $prefijo['prefijo'] . "_" . $tabla : $tabla;


        $existsTable = $this->_manager->existeTablaEnEsquema($esquema, $tabla);


        if ($existsTable[0]['count'] == 0) {

	    $dm = Doctrine_Manager::getInstance();
            $con = $dm->getCurrentConnection();

            $tbl = new DatTabla();
            $tbl->esquema = $esquema;
            $tbl->tabla = strtolower($tabla);
            $tbl->arbol = ($arbol) ? 1 : 0;
            $tbl->importada = 0;
            $tbl->alias = $alias;
            $tbl->idprefijo = $idprefijo;
            $tbl->save();

	    $con->commit();

            $this->_manager->adicionarTabla($esquema, $tabla, $arbol, $alias);

            $module_name = Zend_Registry :: get('config')->module_name;

            $config = Zend_Registry :: get('config')->bd->$module_name;
            $gestor = $config->gestor;

            $idtipodatogestor = $this->_campo_domain->getTipoDatoGestor(1, $gestor);

            $campo = $this->_campo_model->adicionarCampo(
                "id" . substr($tbl->tabla, 4, strlen($tbl->tabla) - 4), $tbl->idtabla, $idtipodatogestor, 0, 19, null,
                1, 0, false
            );
            //Si es nomenclador creo por defecto el campo denominacion

            if ($prefijo['uriprefijo'] == 'nomenclador') {

                $idtipodatogestorcaracteres = $this->_campo_domain->getTipoDatoGestor(2, $gestor);
                $idtipodatogestorfecha = $this->_campo_domain->getTipoDatoGestor(3, $gestor);
                $arrConfig = array('etiqueta' => 'Denominación', 'idexpresionregular' => 4);
                $displayfield = $this->_campo_model->adicionarCampo(
                    "denominacion" . substr($tbl->tabla, 4, strlen($tbl->tabla) - 4), $tbl->idtabla,
                    $idtipodatogestorcaracteres, 0, 255, $arrConfig
                );
                $this->_campo_model->adicionarCampo(
                    "fechainicio", $tbl->idtabla, $idtipodatogestorfecha, 0, null, array('etiqueta' => 'Fecha inicio')
                );
                $this->_campo_model->adicionarCampo(
                    "fechafin", $tbl->idtabla, $idtipodatogestorfecha, 0, null, array('etiqueta' => 'Fecha fin')
                );
                $this->_campo_model->adicionarDisplayField($tbl->idtabla, $displayfield->idcampo);

            }
            $tmp = "{$campo->DatTabla->esquema}.{$campo->DatTabla->tabla}";
            $tmp = str_replace((substr($tabla, 0, 4)), 'sec_', $tmp);
            $tmp = $tmp . '_seq';
            //print_r($tmp);die;
            $this->_manager->crearSecuencia($tmp);
            $this->_manager->definirValorPorDefecto($campo, "nextval ('$tmp')");

            if ($arbol == 1) {


                $tipodatocadena = $this->_campo_domain->getTipoDatoGestor(2, $gestor);
                //echo '**TablaModel';print_r($idtipodatogestor);die;
                $idpadre = $this->_campo_model->adicionarCampo(
                    "id" . substr($tbl->tabla, 4, strlen($tbl->tabla) - 4) . "padre", $tbl->idtabla, $idtipodatogestor,
                    0, 19, null, 0, 0, false
                );
                $this->_campo_model->adicionarCampo(
                    'ordenizq', $tbl->idtabla, $idtipodatogestor, 0, 19, null, 0, 0, false
                );
                $this->_campo_model->adicionarCampo(
                    'ordender', $tbl->idtabla, $idtipodatogestor, 0, 19, null, 0, 0, false
                );
                $this->_campo_model->adicionarCampo(
                    'denominacion', $tbl->idtabla, $tipodatocadena, 0, 255, $values, 0, 0, true
                );
                $fk = 'fk_' . $idpadre;
                $this->_relation_model->crearRelacion($campo, $idpadre, 0, 0, $fk);
                $this->_manager->crearFuncionesArbol($tbl);
            }

            $this->_manager->setCurrentConnection($this->_module);

            return $tbl->toArray();
        } else {

            throw new ZendExt_Exception('XMT001');
        }

    }

    public function importarTabla($esquema, $tabla, $llave = '')
    {
        $this->_manager->setCurrentConnection('xmetacomponent');
        $tbl = $this->_tabla_domain->existeTabla($esquema, $tabla);
        if (!$tbl) {
            $tbl = new DatTabla ();
            $tbl->esquema = $esquema;
            $tbl->tabla = $tabla;
            $tbl->arbol = 0;
            $tbl->importada = 1;
            $tbl->save();

            $module_name = Zend_Registry :: get('config')->module_name;

            $config = Zend_Registry :: get('config')->bd->$module_name;
            $gestor = $config->gestor;

            $idtipodatogestor = $this->_campo_domain->getTipoDatoGestor(1, $gestor);

            if ($llave) {
                $llave_primaria = $llave;
            } else {
                $llave = $this->_manager->obtenerPrimaryKeyDeTabla($esquema, $tabla);
                $llave_primaria = $llave[0]['column_name'];
            }

            $campo = new DatCampo();
            $campo->denominacion = $llave_primaria;
            $campo->llaveprimaria = 1;
            $campo->secuencia = 1;
            $campo->permitenulo = 0;
            $campo->longitud = 19;
            $campo->idtabla = $tbl->idtabla;
            $campo->idtipodatogestor = $idtipodatogestor;
            $campo->save();
        }
        $objTabla = $tbl->toArray();
        $this->_manager->setCurrentConnection($this->_module);
        return $objTabla;
    }

    public function cargaresquemas()
    {
        $schemas = $this->_manager->obtenerEsquemas();
        $result = array();

        foreach ($schemas as $schema) {
            $result[] = array('esquema' => $schema ['schema']);
        }

        $data = new stdClass();
        $data->data = $result;
        $data->total = sizeof($result);

        return $data;
    }

    public function obtenerPrefijoDadoUri($uriprefijo)
    {
        $this->_manager->setCurrentConnection('xmetacomponent');
        $prefijo = $this->_tabla_domain->obtenerPrefijoDadoUri($uriprefijo);
        $this->_manager->setCurrentConnection($this->_module);
        return $prefijo;
    }

    public function modificarAliasTabla($idtabla, $alias)
    {
        $this->_manager->setCurrentConnection('xmetacomponent');
        $objTabla = Doctrine::getTable('DatTabla')->find($idtabla);
        $objTabla->alias = $alias;
        $objTabla->save();
        $this->_manager->setCurrentConnection($this->_module);
        return true;
    }

    public function obtenerObjetoTabla($idtabla)
    {
        $this->_manager->setCurrentConnection('xmetacomponent');
        $objTabla = Doctrine::getTable('DatTabla')->find($idtabla);
        $this->_manager->setCurrentConnection($this->_module);
        return $objTabla;
    }

}