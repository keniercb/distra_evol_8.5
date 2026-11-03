<?php

/**
 * Clase que implementa todos los métodos relacionados con la relación registro numérico - atributos dinámicos
 *
 * @autor Jorge Luis Cuellar Mondeja
 */
class RegNumericoAtribDinamicoModel extends BaseModel
{

    private $metadataModel;
    private $tablaModel;

    /**
     *
     */
    public function __construct()
    {
        parent::__construct();
        $this->metadataModel = ZendExt_Metadata:: getInstance()->Metadata();
        $this->tablaModel = new ZendExt_Metadata_Models_TablaModel();
    }

    /**
     * Adiciona los atributos dinámicos para los registros numéricos
     *
     * @return void
     */
    public function adicionarAtribDinamicosRegNumerico($arrAtributos, $regNumerico)
    {
        $tablePrefijo = array('dat_' => '', 'nom_' => '', 'his_' => '', 'cub_' => '', 'dim_' => '');
        $arrCondWhere = array();

        if ($regNumerico->idregnumerico) {
            $arrCondWhere[] = "idregnumerico = {$regNumerico->idregnumerico}";
        }

        foreach ($arrAtributos as $key => $value) {
            $datos = $value->datos;
            $tabla = $this->tablaModel->obtenerObjetoTabla($value->idtabla);

            $nameTable = strtr($tabla->tabla, $tablePrefijo);
            $configQuery = $this->metadataModel->obtenerInfoTabla($value->idtabla, array(), 'left');

            $keyIdRegNumerico = 'mod_datosmaestrosmeta_' . $tabla->tabla . '_idregnumerico';
            $keyIdMovRegNumerico = 'mod_datosmaestrosmeta_' . $tabla->tabla . '_idmovregnumerico';

            if (count($arrCondWhere)) {
                $configQuery->ar_where = $arrCondWhere;
            }

            $datos->{$keyIdRegNumerico} = $regNumerico->idregnumerico;
            $datos->{$keyIdMovRegNumerico} = $regNumerico->idregnumerico;

            $oldData = $configQuery->get()->result_array();

            if (count($oldData)) {
                $datos = (array)$datos;
                $keyNames = array_keys($oldData[0]);
                foreach ($keyNames as $key2) {
                    if (count(explode($nameTable, $key2)) == 3) {
                        $datos[$key2] = $oldData[0][$key2];
                    }
                }

                $arrayValores = (array)$datos;
                $this->metadataModel->modificarEnMetadatos($value->idtabla, $arrayValores);
            } else {
                $arrayValores = (array)$datos;
                $this->metadataModel->insertarEnMetadatos($value->idtabla, $arrayValores);
            }
        }
    }

    /**
     * Eliminar los atributos dinámicos del registro numérico
     *
     * @return void
     */
    public function eliminarAtribDinHijosRegNumerico($arrHijos)
    {
        foreach ($arrHijos as $value) {
            $arrIdesTabla = $value['arridtablas'];
            $arrIdesTabla = explode(',', $arrIdesTabla);
            $arrIdesTabla = array_unique($arrIdesTabla);

            foreach ($arrIdesTabla as $idTabla) {
                $idTabla += 0;

                if ($idTabla > 0) {
                    $arWhere[0] = "idregnumerico = {$value['idregnumerico']}";
                    $info = $this->metadataModel->obtenerInfoTabla($idTabla, array(), 'left');
                    $info->ar_where = $arWhere;
                    $info->delete();
                    $info->_reset_select();
                }
            }
        }
    }

    /**
     * Retorna un array de idregnumerico que coincida con los criterios dinámicos especificados
     * (obligatorio)activeRecord-> objeto Active Record con la estructura de la consulta para metadatos
     * parametros->arreglo que trae en la pos "datos"[0] los valores dinámicos para hacer la búsqueda
     */
    public function crearSqlBuscarDinamico($activeRecord, $datosDin, $idTabla)
    {
        $conn = Zend_Registry::get('conexion');

        $select = " SELECT rndin.idregnumerico ";
        $from = " FROM mod_logactivofijotangible.dat_registronumerico rndin ";
        $innerJoin = " LEFT JOIN " . $activeRecord->ar_from[0] . " ON rndin.idregnumerico = meta.idregnumerico ";
        $where = " WHERE ";

        foreach ($datosDin as $key => $value) {
            $cadenaFija = 'mod_datosmaestrosmeta_dat_indicadores';

            if (strpos($key, $cadenaFija) === 0) {
                $posiblesCampos = explode('_', $key);

                // Este if se hace por si el campo dinámico esta compuesto por _. ej: dato_de_prueba
                if (count($posiblesCampos) > 5) {

                    $arrCampoString = array();
                    for ($i = 5; $i < count($posiblesCampos); $i++) {
                        $arrCampoString[] = $posiblesCampos[$i];
                    }

                    $campo = implode('_', $arrCampoString);
                } else {
                    $campo = $posiblesCampos[5];
                }

                $sqlTipoDato = "SELECT tdgst.nombre FROM mod_metadata.dat_tipodatogestor tdgst"
                    . " INNER JOIN mod_metadata.dat_campo cmp ON cmp.idtipodatogestor = tdgst.idtipodatogestor "
                    . " WHERE cmp.idtabla = $idTabla AND cmp.denominacion LIKE '$campo'";

                $tipoDato = $conn->execute($sqlTipoDato)->fetchAll(PDO::FETCH_ASSOC);

                if ($tipoDato[0]['nombre'] != 'VARCHAR') {
                    $whereDinamico[] = " meta." . $campo . ' = ' . $value;
                } else {
                    $whereDinamico[] = " meta." . $campo . ' iLIKE ' . "'%" . $value . "%'";
                }
            }
        }


        $activeRecord->_reset_select();
        $datos = array();
        $whereDinamico = implode(' AND ', $whereDinamico);

        if (!$whereDinamico) {
            return $datos;
        }

        $consultSql = $select . $from . $innerJoin . $where . $whereDinamico;
        return $conn->execute($consultSql)->fetchAll(PDO::FETCH_COLUMN);
    }

    /**
     *
     */
    public function getFiltrosBusqAvanzada($elementosXtabla)
    {
        $arrCritDinamicos = array();
        $activeRecord = null;

        foreach ($elementosXtabla as $key => $value) {
            $datos = (array)$value->datos;
            if (count($datos)) {
                if ($value->idtabla != -1 && count($datos) != 0) {

                    // Inicialización de un singlenton
                    $this->metadataModel->obtenerConfigFormulario($value->idtabla);

                    $activeRecord = $this->metadataModel->obtenerInfoTabla($value->idtabla, array(), 'left');
                    $criteriosDinamicos = $this->crearSqlBuscarDinamico(
                        $activeRecord, $datos, $value->idtabla
                    );

                    foreach ($criteriosDinamicos as $keyreg => $valuereg) {
                        if (!in_array($valuereg, $arrCritDinamicos)) {
                            array_push($arrCritDinamicos, $valuereg);
                        }
                    }
                }
            }
        }
        if ($activeRecord)
            $activeRecord->_reset_select();
        return $arrCritDinamicos;
    }

}
