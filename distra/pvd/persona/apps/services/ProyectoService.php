<?php

/**
 * Class ProyectoService
 */
class ProyectoService
{
    /**
     * @var DatProyectoconceptoModel
     */
    protected $objProject;

    /**
     * @var DatNomencladorModel
     */
    protected $objNomenclador;

    /**
     *
     */
    function __construct()
    {
        $this->objProject = new DatProyectoconceptoModel();
        $this->objNomenclador = new DatNomencladorModel();
    }

    /**
     * @param $idproyecto
     * @param $idproyectoconcepto
     *
     * @throws Exception
     */
    public function getConceptAndCampos($idproyecto, $idproyectoconcepto, $widthChecks = false)
    {
        try {
            $format = ($idproyectoconcepto == 'root') ? true : false;
            $r = $this->objProject->getConceptsByProject($idproyecto, $idproyectoconcepto, $format, $widthChecks);

            return $r;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $id
     * @param $filtro
     *
     * @return mixed
     * @throws Exception
     */
    public function getNomencladores($id, $filtro, $limit, $start)
    {
        try {
            return $this->objNomenclador->getNomencladores($id, $filtro, $limit, $start);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param       $id
     * @param array $param
     *
     * @return array|mixed
     * @throws Exception
     */
    public function getDataByNomenclador($id, $param)
    {
        try {
            $nomenclador = $this->objNomenclador->getNomencladores($id);
            if (count($nomenclador) > 0) {
                $sourceData = json_decode($nomenclador->data[0]['getdata']);
                if ($sourceData->class) {
                    if ($sourceData->project) {
                        $this->includeFilesProject($sourceData->project);
                    }
                    $obj = new $sourceData->class;

                    return call_user_func_array(
                        array(
                            $obj, $sourceData->function), $this->reflectArray($param)
                    );
                }
            }

            return array();
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function includeFilesProject($project)
    {
        $dirwww = $_SERVER["DOCUMENT_ROOT"];
        //Direccion del Marco de trabajo relativa a la carpeta de publicacion.
        $dirrelmt = "/";
        //Direccion absoluta del marco de trabajo
        //$dirabsmt = str_replace("//", "/", dirname($dirwww . "..") . "/" . $dirrelmt);
        $dirabsmt = str_replace("web", "apps", $dirwww);
        $config["include_path"] = get_include_path();
        $config["include_path"] .= "" . PATH_SEPARATOR . $dirabsmt .
            "/pvd/persona/projects/$project/models/domain/generated";
        $config["include_path"] .= "" . PATH_SEPARATOR . $dirabsmt . "/pvd/persona/projects/$project/models/domain";
        $config["include_path"] .= "" . PATH_SEPARATOR . $dirabsmt . "/pvd/persona/projects/$project/models/bussines";
        //Se inicializa el include path de php a partir de la variable de configuracion
        set_include_path($config["include_path"]);
    }

    /**
     * @param $data
     *
     * @return array
     */
    public function reflectArray($data)
    {
        if (is_array($data)) {
            return $data;
        } elseif (!empty($data)) {
            return array($data);
        } else {
            return array();
        }
    }

    /**
     * @param $id
     *
     * @return array
     * @throws Exception
     */
    public function getDatosFormConceptosyCampos($id)
    {
        try {
            if (!empty($id)) {
                return $this->objProject->getConceptoByCampo($id);
            } else {
                throw new Exception('Parametros vacio', 3);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getDataByCampo($id, $param, $arrTupla)
    {
        try {
            $arrIds = $this->reflectArray($id);
            $tuplas = $this->reflectArray($arrTupla);
            if (count($arrIds) > 0) {
                $response = array();
                $conceptGetData = $this->objProject->getConceptoByCampo($arrIds[0], true);
                $valToReturn = $this->objProject->getDataExtration($id);
                if (count($conceptGetData) > 0) {
                    $sourceData = $conceptGetData['getdata'];
                    if (!empty($sourceData->project)) {
                        $this->includeFilesProject($sourceData->project);
                    }
                    $obj = new $sourceData->class;
                    $dataTmp = call_user_func_array(
                        array(
                            $obj, $sourceData->function), $this->reflectArray($param)
                    );
                    foreach ($dataTmp->data as $p => $data) {
                        if (count($tuplas) > 0) {
                            if (empty($tuplas[$data[$sourceData->id]])) {
                                continue;
                            }
                        }
                        foreach ($valToReturn as $in => $v) {
                            $response[$p][$in] = $data[$v];
                        }
                        $response[$p]['idtupla'] = $data[$sourceData->id];
                    }
                    $dataTmp->data = $response;

                    return $dataTmp;
                }
            }

            return array();
        } catch (Exception $e) {
            throw $e;
        }
    }
}