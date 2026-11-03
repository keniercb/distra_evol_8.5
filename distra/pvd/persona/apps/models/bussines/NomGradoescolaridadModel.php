<?php
$dirwww = $_SERVER["DOCUMENT_ROOT"];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dirrelmt = "/";
//Direccion absoluta del marco de trabajo
//$dirabsmt = str_replace("//", "/", dirname($dirwww . "..") . "/" . $dirrelmt);
$dirabsmt = str_replace("//", "/", str_replace('web','',$dirwww). $dirrelmt);
$config["include_path"] = get_include_path();
$config["include_path"] .= "" . PATH_SEPARATOR . $dirabsmt . "apps/pvd/persona/projects/siac/models/domain";
//Se inicializa el include path de php a partir de la variable de configuracion
set_include_path($config["include_path"]);

class NomGradoescolaridadModel extends ZendExt_Model
{

    protected $_objGradeScholarship = null;

    function __construct()
    {
        $this->_objGradeScholarship = new NomGradoescolaridad();
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
    public function getGradeScholarshipActive($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objGradeScholarship->getGradeScholarshipActive($filtro, $limit, $start);
            $tmp->quantity = $this->_objGradeScholarship->getCantGradeScholarshipActive($filtro);

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
    public function addGradeScholarship($objGradeScholarship)
    {
        try {
            $objDomain = new NomGradoescolaridad();
            if (!$objDomain->findByIdOrDenom($objGradeScholarship->denominacion)) {
                $obj = new NomGradoescolaridad();
                foreach ($objGradeScholarship as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idgradoescolaridad;
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
     * @param numeric $idgradoescolaridad
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modGradeScholarship($idgradoescolaridad, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $objDomain = new NomGradoescolaridad();
            $result = $objDomain->modGradeScholarship(
                $idgradoescolaridad, $denominacion, $descripcion, $fdesde, $fhasta
            );

            return $result;
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
    public function delGradeScholarship($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomGradoescolaridad');
//            if (is_array($ids)) {
//                $query->whereIn('idgradoescolaridad', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idgradoescolaridad = ?', $arrids);
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

