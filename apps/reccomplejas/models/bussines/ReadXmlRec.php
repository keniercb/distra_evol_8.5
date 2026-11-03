<?php

/**
 * Genera los XMLs necesarios para el funcionamiento del Recuperador Complejo
 * Class XML
 *
 * @author Javier Rodriguez Lopez
 */
class ReadXmlRec extends ZendExt_Model
{

    private $direccionComunXml; //Direcci�n dode voy a salvar todos los XML

    function __construct($idconfiguracion)
    {
        parent::ZendExt_Model();
        /*$register = Zend_Registry::getInstance();
        //Para (MODULO DE ALERTAS Y AVISOS)
        if (isset($_SERVER['PWD'])) {
            $dirBase = $register->config->modulo_path . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR
                . 'configsecodena' .
                DIRECTORY_SEPARATOR . 'reccomplejas' . DIRECTORY_SEPARATOR;
        } else {
            $dirBase = $register->config->modulo_path;
        }
        $this->direccionComunXml = $dirBase . 'comun/recursos/config_reccomplejas/config_' . $idconfiguracion . '/xml/';*/

        $dir_www = $_SERVER['DOCUMENT_ROOT'];
        $this->direccionComunXml = str_replace('web', 'apps', $dir_www) . '/reccomplejas/comun/recursos/config_reccomplejas/config_' . $idconfiguracion . '/xml/';

        if (!file_exists($this->direccionComunXml)) {
            if (!mkdir($this->direccionComunXml, 0777, true)) {
                throw new ZendExt_Exception('Fallo al crear la direccion');
            }
        }
    }

    function getXML($nameFile)
    {
        //Verifico que exista un archivo con ese nombre
        if (file_exists($this->direccionComunXml . $nameFile)) {
            $xmldoc = simplexml_load_file($this->direccionComunXml . $nameFile);

            return $xmldoc;
        } else {
            exit('No existe el archivo ' . $nameFile);
        }
    }

    function setXML($dirXMLFile, $xmldoc)
    {
        //Lo convierto en DOM para despues poder salvarlo en el XML
        $dom_sxe = dom_import_simplexml($xmldoc);
        if (!$dom_sxe) {
            exit('Error while converting XML');
        }
        $dom = new DOMDocument('1.0', 'UTF-8');
        $dom->formatOutput = true;
        $dom_sxe = $dom->importNode($dom_sxe, true);
        $dom_sxe = $dom->appendChild($dom_sxe);
        $pesoDelArchivo = $dom->save($dirXMLFile) . ' bytes'; // Wrote: 72 bytes
    }

    //Funcion genera xml pasandole un arreglo de valores con nivel maximo de 1.
    function generarXML($arrValores, $nombreFichero, $nombrecampo = 'campos', $nombreItem = 'campo')
    {
        if (!file_exists($this->direccionComunXml)) {
            if (!mkdir($this->direccionComunXml, 0777, true)) {
                return false;
            }
        }
        libxml_use_internal_errors(true);
        $dom = new DOMDocument('1.0', 'UTF-8');
        $doc = $dom->appendChild($dom->createElement($nombrecampo));
        foreach ($arrValores as $valor) {
            $nodo = $doc->appendChild($dom->createElement($nombreItem));
            foreach ($valor as $key => $valor1) {
                $nodo->setAttribute($key, $valor1);
            }
        }
        $dom->formatOutput = true;
        if (!$dom->save($this->direccionComunXml . "$nombreFichero.xml")) {
            exit('Error guardando el XML: ' . $nombreFichero);
        }
    }

    /**
     * Genera fichero XML para los campos multievaluados
     *
     * @author Ing. Javier Rodriguez Lopez
     *
     * @param type $arrCampos
     *
     * @return boolean
     */
    public function generaXMLMultievaluado($arrCampos)
    {
        if (!file_exists($this->direccionComunXml)) {
            if (!mkdir($this->direccionComunXml, 0777, true)) {
                return false;
            }
        }
        $dom = new DOMDocument('1.0', 'UTF-8');
        $doc = $dom->appendChild($dom->createElement('campos'));
        if (count($arrCampos) > 0) { //Verifico que existan campos en el arreglo para poder escribir en el.
            $i = 0;
            $idAux = '';
            foreach ($arrCampos as $campoMomentaneo) {
                if ($idAux == $campoMomentaneo['idcampo']) {
                    continue;
                } else {
                    $idAux = $campoMomentaneo['idcampo'];
                    $campo = $campoMomentaneo;
                }
                $campoAux = $doc->appendChild($dom->createElement('campo'));
                $campoAux->setAttribute('idcampo', $campo['idcampo']);

                $valores = $this->buscarTodosIdIguales($arrCampos, 'idcampo', $campo['idcampo']);
                foreach ($valores as $keyValor => $valor) {
                    $valores = $campoAux->appendChild($dom->createElement('valores'));
                    $valores->setAttribute('valor', $valor['valor']);
                    $valores->setAttribute('denominacion', $valor['denominacion']);
                }
                ++$i;
            }
        }
        $dom->formatOutput = true;
        if (!$dom->save($this->direccionComunXml . 'campo_multievaluado.xml')) {
            exit('Error guardando el XML');
        }
    }

    public function generaXmlMapeo($arrCampos)
    {
        if (!file_exists($this->direccionComunXml)) {
            if (!mkdir($this->direccionComunXml, 0777, true)) {
                return false;
            }
        }
        $tipoid = 'idcampo';
        $tipoMapeo = 'idmapeo';
        $tipoUnionMapeo = 'idunion';
        //BORRAR comentario
//        if ($tipoid == 'idmostrar') {
//            $tipoMapeo = 'idmapeomostrar';
//            $tipoUnionMapeo = 'idunionmostrar';
//        } else {
//            $tipoMapeo = 'idmapeocondicion';
//            $tipoUnionMapeo = 'idunioncondicion';
//        }
        $dom = new DOMDocument('1.0', 'UTF-8');
        $doc = $dom->appendChild($dom->createElement('campos'));
        $i = 0;
        $idAux = '';
        foreach ($arrCampos as $key => $campoMomentaneo) {
            if ($idAux == $campoMomentaneo[$tipoid]) {
                //array_splice($arrCampos, $i, 1);
                continue;
            } else {
                $idAux = $campoMomentaneo[$tipoid];
                $campo = $campoMomentaneo;
                // array_splice($arrCampos, $i, 1);
            }
            $campoAux = $doc->appendChild($dom->createElement('campo'));
            $campoAux->setAttribute($tipoid, $campo[$tipoid]);
            $campoAux->setAttribute('esquema', $campo['esquemacampo']);
            $campoAux->setAttribute('tabla', $campo['tablacampo']);
            $campoAux->setAttribute('persisteJoin', $campo['persistejoin']);
            $campoAux->setAttribute('idpersisteJoin', $campo['idpersistejoin']);
            $camino = $campoAux->appendChild($dom->createElement('camino')); //Adiciono la etiqueta camino
            $arrMapeos = $this->buscarTablasMapeo($arrCampos, $tipoid, $campo[$tipoid]);

            $esquemaComparar = "";
            $tablaComparar = "";
            $idMapeo = '';
            $j = 0;
            $n = count($arrMapeos);
            $arrIdMapeos = array();
            while ($j + 1
                < $n) { //Este ciclo es para adicionarle todos los pasos al camino de mapeo para los campos que lo requieran
                //if(array_search($arrMapeos[$j][$tipoMapeo], $arrIdMapeos) === false){
                //$arrIdMapeos[] = $arrMapeos[$j][$tipoMapeo];
                $paso = $camino->appendChild($dom->createElement('paso'));
                $inicio = $paso->appendChild($dom->createElement('inicio'));
                $inicio->setAttribute('esquema', $arrMapeos[$j]['esquema']);
                $inicio->setAttribute('idmapeo', $arrMapeos[$j + 1][$tipoMapeo]);
                $inicio->setAttribute('tabla', $arrMapeos[$j]['tabla']);
                $inicio->setAttribute('persisteJoin', $arrMapeos[$j]['persistejoin']);
                $inicio->setAttribute('idpersisteJoin', $arrMapeos[$j]['idpersistejoin']);

                $final = $paso->appendChild($dom->createElement('final'));
                $final->setAttribute('esquema', $arrMapeos[$j + 1]['esquema']);
                $final->setAttribute('idmapeo', $arrMapeos[$j + 1][$tipoMapeo]);
                $final->setAttribute('tabla', $arrMapeos[$j + 1]['tabla']);
                $final->setAttribute('tipoConexion', $arrMapeos[$j + 1]['tipoconexion']);
                $final->setAttribute('persisteJoin', $arrMapeos[$j + 1]['persistejoin']);
                $final->setAttribute('idpersisteJoin', $arrMapeos[$j + 1]['idpersistejoin']);

                //, $arrMapeos[$j+1][$tipoMapeo]
                //Para realizar el ON busco todos los campos que tienen el mismo id y tambien el mismo esquema y misma tabla
                $arrCamposON = $this->buscarCamposONDelMapeo(
                    $arrCampos, $tipoid, $arrMapeos[$j + 1][$tipoid], $arrMapeos[$j + 1]['esquema'],
                    $arrMapeos[$j + 1]['tabla']
                );
                $arrIDUnionMapeo = array();
                foreach ($arrCamposON as $campoON) {
                    if ($arrMapeos[$j + 1][$tipoid] == $campoON[$tipoid]
                        && $arrMapeos[$j + 1][$tipoMapeo] == $campoON[$tipoMapeo]
                    ) {
                        if ($campoON['campoinicial'] != '') {
                            array_push($arrIDUnionMapeo, $campoON[$tipoUnionMapeo]);
                            $on = $final->appendChild($dom->createElement('on'));
                            $on->setAttribute('campoinicial', $campoON['campoinicial']);
                            $on->setAttribute('operador', quotemeta($campoON['operador']));
                            $on->setAttribute('campofinal', $campoON['campofinal']);
                            $on->setAttribute('logico', $campoON['logico']);
                        }
                        //Modifico el los artibutos del persite Join para el campo.
                        $campoAux->setAttribute('persisteJoin', $campoON['persistejoin']);
                        $campoAux->setAttribute('idpersisteJoin', $campoON['idpersistejoin']);
                    }
                }
                $j++;
            }
            $i++;
        }
        $dom->formatOutput = true;
        if (!$dom->save($this->direccionComunXml . 'mapeo.xml')) {
            exit('Error guardando el XML');
        }
    }

    public function generaXMLCamposGeoespaciales($arrValores, $nombreFichero)
    {
        if (!file_exists($this->direccionComunXml)) {
            if (!mkdir($this->direccionComunXml, 0777, true)) {
                return false;
            }
        }

        $dom = new DOMDocument('1.0', 'UTF-8');
        $doc = $dom->appendChild($dom->createElement('campos'));
        $idcampogeoespacialAux = null;
        $campoGeoespacial = null;
        foreach ($arrValores as $valor) {
            if ($idcampogeoespacialAux != $valor['idcampogeoespacial']) {
                $idcampogeoespacialAux = $valor['idcampogeoespacial'];
                $campoGeoespacial = $doc->appendChild($dom->createElement('campogeoespacial'));
                $campoGeoespacial->setAttribute('idcampogeoespacial', $valor['idcampogeoespacial']);
                $campoGeoespacial->setAttribute('denominacion', $valor['denominacion']);
                $campoGeoespacial->setAttribute('descripcion', $valor['descripcion']);
                $campoGeoespacial->setAttribute('tiporepresentacion', $valor['tiporepresentacion']);

                $campo = $campoGeoespacial->appendChild($dom->createElement('campo'));
                $campo->setAttribute('idcampomostrar', $valor['idcampomostrar']);
                $campo->setAttribute('idmostrar', $valor['idmostrar']);
                $campo->setAttribute('idmetadato', $valor['idmetadato']);
            } else {
                $campo = $campoGeoespacial->appendChild($dom->createElement('campo'));
                $campo->setAttribute('idcampomostrar', $valor['idcampomostrar']);
                $campo->setAttribute('idmostrar', $valor['idmostrar']);
                $campo->setAttribute('idmetadato', $valor['idmetadato']);
            }
        }

        $dom->formatOutput = true;
        if (!$dom->save($this->direccionComunXml . "$nombreFichero.xml")) {
            exit('Error guardando el XML');
        }
    }

    /**
     * Genera XML de Filtros por roles
     *
     * @param $arrFilters
     */
    public function generateFilters($arrFilters)
    {
        try {
            $fileName = 'filtros_rol.xml';
            $dom = new DOMDocument('1.0', 'UTF-8');
            $roles = $dom->appendChild($dom->createElement('roles'));

            if (!empty($arrFilters)) {
                $lastRolName = '';
                $role = null;
                foreach ($arrFilters as $filter) {
                    $rolName = "role_{$filter['idrol']}";
                    if ($lastRolName != $rolName) {
                        $lastRolName = $rolName;

                        $role = $roles->appendChild($dom->createElement($rolName));
                    }

                    $filterXml = $role->appendChild($dom->createElement('filter'));
                    $filterXml->setAttribute('idcampo', $filter['idcampo']);
                    $filterXml->setAttribute('condicion', quotemeta($filter['condicion']));
                    $filterXml->setAttribute('valor', quotemeta($filter['valor']));
                    $filterXml->setAttribute('logico', $filter['logico']);
                    $filterXml->setAttribute('orden', $filter['orden']);
                    $filterXml->setAttribute('esquema', $filter['esquema']);
                    $filterXml->setAttribute('tabla', $filter['tabla']);
                    $filterXml->setAttribute('campo', $filter['campo']);
                    $filterXml->setAttribute('idtabla', $filter['idtabla']);
                    $filterXml->setAttribute('tipodato', $filter['tipodato']);
                    $filterXml->setAttribute('sqlwhere', $filter['sqlwhere']);
                    $filterXml->setAttribute('usarcondicion', $filter['usarcondicion']);
                }
            }

            $dom->formatOutput = true;
            if (!$dom->save($this->direccionComunXml . $fileName)) {
                return "Error guardando el XML {$fileName}";
            }

            return "Archivo {$fileName} generado correctamente.";
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Genera XML de Acceso por roles a los campos
     *
     * @param $arrAccess
     */
    public function generateAccess($arrAccess)
    {
        try {
            $fileName = 'acceso_rol.xml';
            $dom = new DOMDocument('1.0', 'UTF-8');
            $roles = $dom->appendChild($dom->createElement('roles'));

            if (!empty($arrAccess)) {
                $lastRolName = '';
                $stIdCampo = '';
                $role = null;

                foreach ($arrAccess as $access) {
                    $rolName = "role_{$access['idrol']}";

                    if ($lastRolName != $rolName) {
                        $lastRolName = $rolName;

                        $role = $roles->appendChild($dom->createElement($rolName));
                    }
                    $stIdCampo .= $access['idcampo'] . ',';
                    $role->setAttribute('access', substr($stIdCampo, 0, -1));
                }
            }

            $dom->formatOutput = true;
            if (!$dom->save($this->direccionComunXml . $fileName)) {
                return "Error guardando el XML {$fileName}";
            }

            return "Archivo {$fileName} generado correctamente.";
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    //Funciones auxiliar
    private function buscarTodosIdIguales($arrCampos, $tipoid, $valorid)
    {
        $result = array();
        foreach ($arrCampos as $campo) {
            if ($campo[$tipoid] == $valorid) {
                $result[] = $campo;
            }
        }

        return $result;
    }

    private function buscarTablasMapeo($arrCampos, $tipoid, $valorid)
    {
        $result = array();
        $esquemaComparar = "";
        $tablaComparar = "";
        foreach ($arrCampos as $campo) {
            if ($campo[$tipoid] == $valorid
                && ($esquemaComparar != $campo['esquema']
                    || $tablaComparar != $campo['tabla']
                    || $campo['logico'] == '')
            ) {
                $result[] = $campo;
                $esquemaComparar = $campo['esquema'];
                $tablaComparar = $campo['tabla'];
            }
        }

        return $result;
    }

    //Funcion que busca todos los campos on que se necesitan para el mapeo en dependecia de la tabla que se esta mapeando
    private function buscarCamposONDelMapeo($arrMapeos, $tipoid, $valorid, $esquema, $tabla)
    { //, $idmapeo
        $result = array();
        foreach ($arrMapeos as $campo) {
            if ($campo[$tipoid] == $valorid && $campo['esquema'] == $esquema && $campo['tabla'] == $tabla) {
                //if($campo[$tipoid] == $valorid && $campo[$tipoMapeo] == $idmapeo){
                $result[] = $campo;
            }
        }

        return $result;
    }

}