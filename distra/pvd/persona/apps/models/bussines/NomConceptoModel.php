<?php

/**
 * Class NomConceptoModel
 */
include_once(Zend_Registry::get('config')->dir_aplication . '/pvd/comun/recursos/zip_min.php');
include_once(Zend_Registry::get('config')->dir_aplication . '/pvd/comun/recursos/pclzip.lib.php');

class NomConceptoModel extends ZendExt_Model
{
    /**
     * @var NomConcepto
     */
    protected $objNomConcept;

    /**
     *
     */
    function __construct()
    {
        $this->objNomConcept = new NomConcepto();
    }

    /**
     *
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param array $data Estructura de entrada [{attr:{},child:[]}]
     * @throws Doctrine_Collection_Exception
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function addConcept(array $data)
    {
        try {
            if (count($data) > 0) {
                $validate = $this->objNomConcept->validateByDenominacion($data[0]->attr->denominacion);

                if (!$validate) {
                    $collection = $this->generateCollectToSave($data);

                    $collection->save();
                } else {
                    throw new Exception('Ya existe un concepto registrado con esa denominacion', 3);
                }
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $data
     * @throws Doctrine_Collection_Exception
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function addConceptToImport(array $data)
    {
        try {
            if (count($data) > 0) {
                $validate = $this->objNomConcept->validateByDenominacion($data[0]['attr']['denominacion']);

                if (!$validate) {
                    $collection = $this->generateCollectToSaveImport($data);
                    $collection->save();
                } else {
                    throw new Exception('Ya existe un concepto registrado con esa denominacion', 3);
                }
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }


    /**
     * @param array $data
     * @throws Exception
     */
    public function exportConcept(array $data)
    {
        try {
            $zipfile = new zipfile();
            $this->formatStringValue($data, $nombre);
            $zipfile->addFile(json_encode($data), '' . $nombre . '.json');
            header("Content-type: application/octet-stream");
            header("Content-disposition: attachment; filename=" . $nombre . ".zip");
            echo $zipfile->file();
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $zipFile
     * @throws Exception
     */
    public function importConcept($zipFile)
    {
        try {
            $tmpFileDir = Zend_Registry::get('config')->dir_aplication . 'pvd/persona/comun/recursos/' . $zipFile["name"];
            if (move_uploaded_file($zipFile["tmp_name"], $tmpFileDir)) {
                $archive = new PclZip($tmpFileDir);
                $concept = $this->loadConceptData($archive->extract(PCLZIP_OPT_EXTRACT_AS_STRING));
                unlink($tmpFileDir);
            }

            return $concept;

        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $files
     * @throws Doctrine_Collection_Exception
     * @throws Exception
     */
    public function loadConceptData($files)
    {
        try {
            foreach ($files as $val) {
                $cData = json_decode($val['content'], true);

                self::addConceptToImport($cData);

            }
        } catch (Exception $e) {
            throw $e;
        }
    }


    /**
     * @param array $data Estructura de entrada [{attr:{},child:[]}]
     * @param       $objCollection
     *
     * @return Doctrine_Collection
     */
    private function generateCollectToSave(array $data, $objCollection)
    {

        $collection = isset($objCollection) ? $objCollection : new  Doctrine_Collection('NomConcepto');
        foreach ($data as $p => $v) {
            foreach ($v->attr as $k => $attr) {
                $collection[$p]->$k = $attr;
            }
            if ($v->attr->tipo == 1) {
                $collection[$p]->idpadre = 1;
            }
            if (count($v->child) > 0) {
                $collection[$p]['NomConcepto'] = $this->generateCollectToSave($v->child, $collection[$p]['NomConcepto']);
            }
        }
        return $collection;
    }

    /**
     * @param array $data
     * @param $objCollection
     * @return Doctrine_Collection
     */
    private function generateCollectToSaveImport(array $data, $objCollection)
    {

        $collection = isset($objCollection) ? $objCollection : new  Doctrine_Collection('NomConcepto');
        foreach ($data as $p => $v) {
            foreach ($v['attr'] as $k => $attr) {
                $collection[$p]->$k = $attr;
            }
            if ($v['attr']['tipo'] == 1) {
                $collection[$p]->idpadre = 1;
            }
            if (count($v['child']) > 0) {
                $collection[$p]['NomConcepto'] = $this->generateCollectToSaveImport($v['child'], $collection[$p]['NomConcepto']);
            }
        }
        return $collection;
    }

    /**
     * @param $filtro
     * @param $limit
     * @param $start
     *
     * @return mixed
     * @throws Exception
     */
    public function getConceptosDenominacion($filtro, $limit, $start)
    {
        try {
            $r = new StdClass();
            $r->datos = $this->objNomConcept->getConceptosDenominacin($filtro, $limit, $start);
            $r->cantidad = $this->objNomConcept->getCantConceptosDenominacion($filtro);

            return $r;
        } catch (Exception $e) {
            throw $e;
        }
    }


    /**
     * @param array $data
     * @param $nombre
     */
    private function formatStringValue(array $data, &$nombre)
    {
        $cadenaReemplazar = $vocales = array("a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "u", " ");
        $cadenaBuscar = $vocales = array("á", "é", "í", "ó", "ú", "à", "è", "ì", "ò", "ù", "ü", "'");
        $name = str_replace(' ', '', $data[0]->attr->denominacion);
        $name = trim($name);
        $name = mb_strtolower($name, 'UTF-8');
        $nombre = str_replace($cadenaBuscar, $cadenaReemplazar, $name);
    }
}