<?php
$dirwww = $_SERVER["DOCUMENT_ROOT"];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dirrelmt = "/";
//Direccion absoluta del marco de trabajo
$dirabsmt = str_replace("//", "/", dirname($dirwww . "..") . "/" . $dirrelmt);
$config["include_path"] = get_include_path();
$config["include_path"] .= "" . PATH_SEPARATOR . $dirabsmt . "apps/pvd/persona/projects/siac/models/domain";
//Se inicializa el include path de php a partir de la variable de configuracion
set_include_path($config["include_path"]);

class NomNiveleducacionalModel extends ZendExt_Model
{

    protected $_objEducationalLevel = null;

    function __construct()
    {
        $this->_objEducationalLevel = new NomNiveleducacional();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener los tipo cargo nivel educacional activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return abjectArray
     * @throws Exception
     */
    public function getEducationalLevelActive($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objEducationalLevel->getEducationalLevelActive($filtro, $limit, $start);
            $tmp->quantity = $this->_objEducationalLevel->getCantEducationalLevelActive($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar tipo cargo nivel educacional
     *
     * @param object $objskincolor
     *
     * @return numeric
     */
    public function addEducationalLevel($_objEducationalLevel)
    {
        try {
            $objDomain = new NomNiveleducacional();
            if (!$objDomain->findByIdOrDenomadd($_objEducationalLevel->denominacion)) {
                $obj = new NomNiveleducacional();
                foreach ($_objEducationalLevel as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idniveleducacional;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para maodificar tipo cargo nivel educacional
     *
     * @param numeric $idniveleducacional
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modEducationalLevel($idniveleducacional, $denominacion, $abrev, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!NomNiveleducacional::findByIdOrDenom($denominacion, $idniveleducacional)) {
                $objDomain = new NomNiveleducacional();
                $result = $objDomain->modEducationalLevel(
                    $idniveleducacional, $denominacion, $abrev, $descripcion, $fdesde, $fhasta
                );
                if ($result) {
                    return $result;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    /**
     * Funcion para eliminar tipo cargo nivel educacional
     *
     * @param array $arrids
     *
     * @return value
     */
    public function delEducationalLevel($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomNiveleducacional');
//            if (is_array($ids)) {
//                $query->whereIn('idniveleducacional', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idniveleducacional = ?', $arrids);
            }
            $result = $query->execute();

            return $result->delete();
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r->exception = 1;

                return $r;
            } else {
                return (json_encode($e->getMessage()));
            }
        }
    }

}

