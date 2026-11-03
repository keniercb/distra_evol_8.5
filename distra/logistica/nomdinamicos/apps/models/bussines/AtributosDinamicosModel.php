<?php

/**
 * @author     Jorge Luis Cuellar Mondeja
 * @package    ConfiguraciÃ³n
 * @subpackage ComÃºn/Models/Bussines
 * @copyright  XETID
 * @version    1.0-0
 * @date       31/08/2013
 */


class AtributosDinamicosModel extends ZendExt_Model
{
    /**
     * @var ZendExt_Metadata_Models_CampoModel
     */
    public $campoModel;

    /**
     * @var ZendExt_Metadata_Models_TablaModel
     */
    public $tablaModel;

    /**
     * @var ZendExt_Metadata_Models_RelacionModel
     */
    public $relacionModel;

    /**
     * @var
     */
    public $metadataModel;

    /**
     * @var array
     */
    protected $remplace;

    /**
     * @var array
     */
    protected $tablePrefijo;

    public function __construct()
    {
        $this->campoModel = new ZendExt_Metadata_Models_CampoModel();
        $this->tablaModel = new ZendExt_Metadata_Models_TablaModel();
        $this->relacionModel = new ZendExt_Metadata_Models_RelacionModel();
        $this->metadataModel = ZendExt_Metadata :: getInstance()->Metadata();
        $this->remplace = array(
            ' ' => '_', '(' => '_', ')' => '_', '/' => '_', 'Ã¡' => 'a', 'Ã©' => 'e', 'Ã­' => 'i',
            'Ã³' => 'o', 'Ãº' => 'u', 'Ã±' => 'n', 'Ã�' => 'A', 'Ã‰' => 'E', 'Ã�' => 'I', 'Ã“' => 'O',
            'Ãš' => 'U', 'Ã‘' => 'N');
        $this->tablePrefijo = array('dat_' => '', 'nom_' => '', 'his_' => '', 'cub_' => '', 'dim_' => '');

        parent::ZendExt_Model();
    }

    /**
     * Obtiene los tipos de datos
     *
     * @return mixed Tipos de Datos
     */
    public function GetTiposDatos()
    {
        return $this->campoModel->cargarTiposDatos();
    }

    /**
     * Obtiene las expresiones regulares
     *
     * @return mixed Expresiones Regulares
     */
    public function GetExpresionesRegulares()
    {
        return $this->campoModel->cargarExpresionesRegulares();
    }

    /**
     * Obtiene los nomencladores
     *
     * @return mixed Nomencladores
     */
    public function GetTablasNomencladores()
    {
        return $this->tablaModel->cargarNomencladores();
    }

    /**
     * Obtiene los campos de Nomencladores
     *
     * @param int $idtabla Identificador de tabla
     *
     * @return array Nomencladores
     */
    public function GetCamposTablasNomencladores($idtabla)
    {
        $datos = $this->campoModel->obtenerCamposConRepresentacion($idtabla);

        foreach ($datos as $dato) {
            $respuesta[] = Array('idcampo' => $dato['idcampo'], 'denominacion' => $dato['DatComponente']['etiqueta'],
                'name' => $dato['denominacion']);
        }

        return $respuesta;
    }

    /**
     * Obtiene los datos del grid
     *
     * @param mixed $parametros
     *
     * @return array
     */
    public function GetDatosGrid($parametros)
    {
        $data = array();
        /*
         *  Caso de los atributos globales (llenar desde el nomenclador)
         */
        if ($parametros['arridtablasgenerales']) {
            $data = self::datosGrid($parametros['arridtablasgenerales'], $data);
        }
        /*
         *  Caso de los atributos hijos (llenar desde componentes hijos del nomenclador)
         */
        if ($parametros['arridtablas']) {
            $data = self::datosGrid($parametros['arridtablas'], $data);
        }
        return array('data' => $data, 'total' => count($data));
    }

    /**
     * Obtiene los datos del grid
     *
     * @param $parametros
     * @param $data
     *
     * @return array
     */
    private function datosGrid($parametros, $data)
    {
        if (!is_array($parametros)) {
            $parametros = explode(',', stripcslashes($parametros));
        }
        foreach (array_unique($parametros) as $idtabla) {
            if ($idtabla && $idtabla != -1) {
                $datos = $this->campoModel->obtenerCamposConRepresentacion($idtabla);
                foreach ($datos as $dato) {
                    if (strlen($dato['DatComponente']['etiqueta'])) {
                        $dato['idtabla'] = $idtabla;
                        $dato['general'] = true;
                        $data[count($data)] = $dato;
                    }
                }
            }
        }
        return $data;
    }

    /**
     * Obtiene los datos del Property Grid
     * @param $parametros
     *
     * @return array
     */
    public function GetDatosPropertyGrid($parametros)
    {
        $arrIdesTabla = json_decode(stripcslashes($parametros['arrIdesTablas']));
        $idioma = json_decode($parametros['idioma']);
        $ar_where = explode(',', $parametros['ar_where']);
        $datos = array();
        $items = array();

        if (!is_array($arrIdesTabla)) {
            $arrIdesTabla = explode(',', $arrIdesTabla);
            $arrIdesTabla = array_unique($arrIdesTabla);
        }
        foreach ($arrIdesTabla as $idtabla) {
            if ($idtabla != -1) {
                /**
                 *  Busco si existen campos para la tabla
                 */
                $configFormulario = $this->metadataModel->obtenerConfigFormulario($idtabla);
                $_items = $configFormulario->items;
                unset($configFormulario->items);

                if (count($_items)) {
                    /**
                     * Creo el query para buscar los valores de los campos
                     */
                    $configQuery = $this->metadataModel->obtenerInfoTabla($idtabla);
                    $temp_alias = $configQuery->ar_select;
                    if (count($ar_where)) {
                        $configQuery->ar_where = $ar_where;
                    }
                    /**
                     * Obtengo los datos
                     */
                    $respuesta = $configQuery->get()->result_array();
                    $datos_new = array();
                    foreach ($respuesta as $pos => $dat) {
                        $i = 0;
                        foreach ($dat as $index => $d) {
                            $temppos = substr($temp_alias[$i], strrpos($temp_alias[$i], ' as ') + 4);
                            $datos_new[$pos][$temppos] = $respuesta[$pos][$index];
                            unset($respuesta[$pos][$index]);
                            $i++;
                        }
                    }

                    $datos[] = $datos_new[0];
                    $items[] = array('items' => $_items, 'idtabla' => $idtabla);
                }
            }
        }
        /**
         * Conformo la respuesta
         */
        $data = array();
        foreach ($items as $item) {
            self::conformarDatosProGrid($item, $datos, $idioma, $data);
        }
        return array('data' => $data);
    }

    /**
     * Conforma los datos del grid
     * @param $item
     * @param $datos
     * @param $idioma
     *
     * @return array
     */
    private function conformarDatosProGrid($item, $datos, $idioma, &$data)
    {
        foreach ($item['items'] as $value) {
            if (strlen($value['fieldLabel'])) {
                $value['idtabla'] = $item['idtabla'];
                $value['data'] = '';
                foreach ($datos as $dato) {
                    foreach ($dato as $keyValue => $valueData) {
                        if ($value['name'] == $keyValue || $value['hiddenName'] == $keyValue) {
                            $value = self::conformarDatos($idioma, $value, $valueData);
                        }
                    }
                }
                $data[count($data)] = $value;
            }
        }
//        return $data;
    }

    /**
     * Conforma los ultimos datos del grid
     * @param $idioma
     * @param $value
     * @param $valueData
     *
     * @return mixed
     */
    private function conformarDatos($idioma, $value, $valueData)
    {
        if ($value['xtype'] == 'checkbox') {
            $value['data'] = ($valueData == 1) ? $idioma->lbSi : $idioma->lbNo;
            return $value;
        } else {
            if ($value['xtype'] == 'datefield') {
                $fecha = explode('[/-]', $valueData);
                $value['data'] = (strlen($fecha[0]) == 4) ?
                    $fecha[2].'/'.$fecha[1].'/'.$fecha[0] : $valueData;
                return $value;
            } else {
                $value['data'] = $valueData;
                return $value;
            }
        }
    }

    /**
     * Inserta atributos din\xE1micos
     *
     * @param $parametros
     *
     * @return bool
     */
    public function InsertarAtribDinamico($parametros)
    {
        /**
         *  (1) Verificamos si el nuevo atributo es para que el propio (global) componente registre sus valores o es
         *      para que algÃºn objeto que herede del mismo sea el que registre sus valores
         */
        if (!$parametros['global'] || ($parametros['global'] && $parametros['global'] != 'on')) {
            $nivel = '_g'; // Nivel general (_g) --- Caso de registro numerico que es el que llenan los valores.
            $idtabla = $parametros['idtabla'];
        } else {
            $nivel = '_h'; //Nivel hijos (_h) --- Caso que desde el indicador se llenan los valores
            $idtabla = $parametros['idtablageneral'];
        }
        if ($parametros['permite_nulo']) {
            if ($parametros['permite_nulo'] == 'on') {
                $parametros['permite_nulo'] = 1;
            } else if ($parametros['permite_nulo'] != 1) {
                $parametros['permite_nulo'] = 0;
            }
        } else {
            $parametros['permite_nulo'] = 1;
        }
        //$permiteNulo = ($parametros['permite_nulo'] && $parametros['permite_nulo'] == 'on') ? 0 : 1;
        /**
         * (1.1) Verificar que al tratar de insertar el nuevo atributo, este cuente con una tabla metadatos
         */
        if (!$idtabla || $idtabla == -1) { // (1.2) Si no exite la tabla, la creo
            $llaverdefecto = json_decode($parametros['llavesDefecto']);
            //print_r(array($parametros['schema'],$parametros['prefijoTabla'],$nivel,$parametros['idObjeto'],false,3,'',$llaverdefecto));die;
            $idtabla = self::AdicionarTabla(
                    $parametros['schema'], ($parametros['prefijoTabla'].$nivel.$parametros['idObjeto']), false, 3,'',
                    json_decode($parametros['llavesDefecto'])
            );
            //print_r($idtabla);die;
        }
        $idtablaorigen = $parametros['idtablaNom']; //-------- Adrian
        $parametros['idtabla'] = $idtabla;

        /**
         * (2) Se inserta el nuevo atributo
         */
        $denominacion = strtolower(
            strtr($parametros['etiqueta'], $this->remplace)
        ); // Remplazo todos los caractÃ©res especiales

        $parametros['denominacion'] = $denominacion;
        $parametros['filtrado'] = 0;
        if ($this->campoModel->existeCampoEnTabla($idtabla, $denominacion) == 0) {
            $campof = $this->campoModel->obtenerPrimaryKeyDadoIdtabla($idtablaorigen);
            $displayF = $this->campoModel->obtenerDisplayFieldDadoIdtabla($idtablaorigen);

            $parametros ['idcampodf'] = $displayF->denominacion; //nombre del campo que mostraria, ejemplo: denominacioncolor, etc.
            $parametros ['idcampovf'] = $campof->idcampo; //nombre del campo q es la llave de la tabla q cogi

            $campo = $this->campoModel->adicionarCampo($denominacion, $idtabla, $parametros['idtipodato'],
                $parametros['permite_nulo'], $parametros['longitud'], $parametros);
            if ($campo) {
                if ($parametros['idatributo']) {
                    return array('idtabla' => $idtabla, 'campo' => $campo->toArray(), 'nivelnomenclador' => $parametros['nivelnomenclador']);
                } else {
                    return $idtabla;
                }
            }
        } else {
            return false;
        }
    }

    /**
     * Verifica los par\xE1metros
     *
     * @param $parametros
     *
     * @return array
     */
    private function verificarParametros($parametros)
    {
        if (!$parametros['global'] || ($parametros['global'] && $parametros['global'] != 'on')) {
            $nivel = '_g'; // Nivel general (_g), Nivel hijos (_h)
            $idtabla = $parametros['idtabla'];
            return array($nivel, $idtabla);
        } else {
            $nivel = '_h';
            $idtabla = $parametros['idtablageneral'];
            return array($nivel, $idtabla);
        }
    }

    /**
     * Modifica los atributos din\xE1micos
     *
     * @param $parametros
     */
    public function ModificarDenomAtribDinamico($parametros)
    {

        $this->_manager = new ZendExt_Metadata_Sql_Manager();
        $this->_manager->setCurrentConnection('xmetacomponent');

        $field = Doctrine :: getTable('DatCampo')->find($parametros['idcampo']);
        $field->DatComponente->etiqueta = $parametros['etiqueta'];

        $field->save();
    }

    /**
     * Adicionar una nueva tabla
     *
     * @param $schema          string Esquema a guardar los datos
     * @param $name            string Nombre de la nueva tabla
     * @param $tree            bool Si la tabla es tipo \xE1rbol
     * @param $type            integer Tipo de tabla ha adicionar (2 - Datos, 3 - Nomenclador)
     * @param $llavesDefecto   stdClass Arreglo de columnas de tipo numeric(19,0) que se quieran poner por defecto
     *
     * @retun integer Llave de la tabla creada
     */
    public function AdicionarTabla($schema, $name, $tree, $type, $alias, $llavesDefecto)
    {
        $tabla = $this->tablaModel->adicionarTabla($schema, strtolower(strtr($name, $this->remplace)), $tree, $type,
            $alias);
        $idtabla = $tabla['idtabla'];
        if ($llavesDefecto) {
            foreach ($llavesDefecto as $denominacion) {
                $this->campoModel->adicionarCampo($denominacion, $idtabla, 1, 0, 19,
                    array("controller" => 'AtributosDinamicos', "action" => 'adicionarcampos', "module" => 'default', "idtabla" => $idtabla,
                    "filtrado" => 0, "decimal" => 0, "denominacion" => '', "idcampo" => '', "idtipodato" => 1, "etiqueta" => '',
                    "longitud" => 19, "precision" => '', "limite_inferior" => '', "limite_superior" => ''));
            }
        }

        return $idtabla;
    }

    /**
     * Inserta los valores
     *
     * @param $parametros
     */
    public function InsertarValoresAction($parametros)
    {
        $elementosXtabla = json_decode($parametros['elementosXtabla']);
        $llavesForaneas = json_decode($parametros['llavesForaneas']);

        $ar_where = explode(',', $parametros['ar_where']);
        foreach ($elementosXtabla as $key => $value) {
            $datos = $value->datos;
            $tabla = $this->tablaModel->obtenerObjetoTabla($value->idtabla);
            $nameTable = strtr($tabla->tabla, $this->tablePrefijo);

            $configQuery = $this->metadataModel->obtenerInfoTabla($value->idtabla);

            if (count($ar_where)) {
                $configQuery->ar_where = $ar_where;
            }
            $oldData = $configQuery->get()->result_array();
            foreach ($llavesForaneas as $llave) {
                $nombreCampo = $parametros['schema'].'_'.$tabla->tabla.'_'.$llave->key;
                $datos->{$nombreCampo} = $llave->value;
            }
            if (count($oldData)) {
                $datos = (array) $datos;
                $names_key = array_keys($oldData[0]);
                foreach ($names_key as $key2) {
                    if (count(explode($nameTable, $key2)) == 3) {
                        $datos[$key2] = $oldData[0][$key2];
                    }
                }
                $arrayValores = (array) $datos;
                $this->metadataModel->modificarEnMetadatos($value->idtabla, $arrayValores/* (array) $datos */);
            } else {
                $arrayValores = (array) $datos;
                $this->metadataModel->insertarEnMetadatos($value->idtabla, $arrayValores);
            }
        }
    }

    /**
     * Elimina los atributos din\xE1micos
     *
     * @param $idcampo
     */
    public function EliminarAtribDinamico($idcampo)
    {
        $this->campoModel->eliminarCampo($idcampo);
    }

    /*
     * asocioa atributos dinamicos utilizando el cmp de las agrupaciones en el cmp de maestroproducto
     */

    public function AsociarAtrbDinamico($parametros)
    {
        $result = array();
        $arregloDuplicados = null;
        foreach ($parametros['idatributos'] as $idatri) {
            $objeto = Doctrine::getTable('DatAtributoestatico')->find($idatri->idatributo);
            $arrayObj = $objeto->toArray();
            $arrayParam = $parametros;

            $arrayCompleto = array_merge($arrayObj, $arrayParam);
            if ($arrayCompleto['nivelnomenclador'] == 1) {
                $arrayCompleto['global'] = 'on';
                $arrayCompleto['llavesDefecto'] = json_encode(array("idindicador"));
            } else {
                $arrayCompleto['llavesDefecto'] = json_encode(array("idregnumerico", "idmovregnumerico"));
            }
            $arrayCompleto['etiqueta'] = $arrayCompleto['denominacion'];
            $arrayCompleto['permite_nulo'] = $arrayCompleto['permitenulo'];

            $arrayCompleto['idtablaNom'] = $arrayCompleto['idtablanomdinamico'];

            if ($arrayCompleto['idtablaNom'] != -1 && $arrayCompleto['idtablaNom'] != null) {
                $arrayCompleto = $this->completarDatosParaTipoDNomenclador($arrayCompleto);
            }
            unset($arrayCompleto['permitenulo']);
            unset($arrayCompleto['denominacion']);
            unset($arrayCompleto['idtablanomdinamico']);

            $arrayCampoidtabla = self::InsertarAtribDinamico($arrayCompleto);
            $result['idtabla'] = $arrayCampoidtabla['idtabla'];
            if (!$arrayCampoidtabla) {
                $arregloDuplicados[] = $arrayCompleto['etiqueta'];
            } else {
                if ($arrayCompleto['global']) {
                    $parametros['idtablageneral'] = $arrayCampoidtabla['idtabla'];
                    $result['columna'] = 'idtablasgenerales';
                } else {
                    $parametros['idtabla'] = $arrayCampoidtabla['idtabla'];
                    $result['columna'] = 'idtablas';
                }
                $this->actalizarIndicadores($arrayCampoidtabla, $arrayCompleto['idObjeto']);
                $atributoIndicador = new DatConfAtributoIndicador();
                $atributoIndicador->idindicador = $arrayCompleto['idObjeto'];
                $atributoIndicador->idatributo = $idatri->idatributo;
                $atributoIndicador->idagrupacion = $idatri->idagrupacion;
                $atributoIndicador->idcampo = $arrayCampoidtabla['campo']['idcampo'];
                $atributoIndicador->save();
            }
        }

        if ($parametros['eliminarIdsAtri']) {
            $this->eliminarAsociacion($parametros['eliminarIdsAtri'], $parametros['idObjeto']);
        }
        $result['duplicados'] = $arregloDuplicados;
        return $result;
    }

    public function eliminarAsociacion($idsatributos, $idindicador)
    {
        foreach ($idsatributos as $id) {
            $objCfgAI = Doctrine::getTable('DatConfAtributoIndicador')
                ->findByDql('idindicador = ? AND idatributo = ?', array($idindicador, $id));
            $arreglo = $objCfgAI->toArray();
            $this->EliminarAtribDinamico($arreglo[0]['idcampo']);
            $objCfgAI->delete();
        }
    }

    public function actalizarIndicadores($parametros, $idindicador)
    {

        //$obj = $this->integrator->logistica->instanceMaestroProductoModel();
        if ($parametros['nivelnomenclador'] == 1) {
            $datos['primaryKeyField'] = 'idindicador';
            $datos['idindicador'] = $idindicador;
            $datos['idtablageneral'] = $parametros['idtabla'];
            $datos['atributodinamico'] = true;
        } else {
            $datos['primaryKeyField'] = 'idindicador';
            $datos['idindicador'] = $idindicador;
            $datos['idtabla'] = $parametros['idtabla'];
            $datos['atributodinamico'] = true;
        }
        $result = $this->integrator->logistica->adicionarNodoClasificador($datos);
        return $result;
    }

    /*
     * metodo que busca los datos que faltan cuando se quiere 
     * asociar un atributo de tipo nomenclador
     */

    public function completarDatosParaTipoDNomenclador($arrayCompleto)
    {
        $datosNomDinam = $this->GetCamposTablasNomencladores($arrayCompleto['idtablaNom']);
        foreach ($datosNomDinam as $key => $value) {
            if (preg_match("/denominacion/i", $value['name'])) {
                $arrayCompleto['idcampo'] = $value['idcampo'];
                break;
            }
        }
        $tabla = $this->tablaModel->obtenerObjetoTabla($arrayCompleto['idtablaNom']);
        $arrtabla = $tabla->toArray();
        $strinmg = str_replace('nom_', 'id', $arrtabla['tabla']);
        $arrayCompleto['idcampovf'] = $strinmg;
        $arrayCompleto['tabla'] = $arrayCompleto['idtablaNom'];
        $arrayCompleto['cmbcampodf'] = $arrtabla['tabla'];
        $arrayCompleto['cmbcampovf'] = $arrtabla['tabla'];
        return $arrayCompleto;
    }

}
