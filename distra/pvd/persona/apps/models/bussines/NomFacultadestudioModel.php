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

class NomFacultadestudioModel extends ZendExt_Model
{

    protected $_objFacultyOfStudy = null;

    function __construct()
    {
        $this->_objFacultyOfStudy = new NomFacultadestudio();
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
    public function getFacultyOfStudyActive($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objFacultyOfStudy->getFacultyOfStudyActive($filtro, $limit, $start);
            $tmp->quantity = $this->_objFacultyOfStudy->getCantFacultyOfStudyActive($filtro);

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
    public function addFacultyOfStudy($objFacultyOfStudy)
    {
        try {
            $objDomain = new NomFacultadestudio();
            if (!$objDomain->findByIdOrDenomadd($objFacultyOfStudy->denominacion)) {
                $obj = new NomFacultadestudio();
                foreach ($objFacultyOfStudy as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idfacultadestudio;
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
     * @param numeric $idfacultadestudio
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modFacultyOfStudy($idfacultadestudio, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!NomFacultadestudio::findByIdOrDenom($denominacion, $idfacultadestudio)) {
                $objDomain = new NomFacultadestudio();
                $result = $objDomain->modFacultyOfStudy(
                    $idfacultadestudio, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta
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
    public function delFacultyOfStudy($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomFacultadestudio');
//            if (is_array($ids)) {
//                $query->whereIn('idfacultadestudio', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idfacultadestudio = ?', $arrids);
            }
            $result = $query->execute();
            if ($result->delete()) {
                $r['exception'] = 0;
            }

            return $r;
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r['exception'] = 1;

                return $r;
            } else {
                return (json_encode($e->getMessage()));
            }
        }
        /* try {
             $query = Doctrine_Query::create();
             $query->from('NomFacultadestudio');
             if (is_array($ids)) {
                 $query->whereIn('idfacultadestudio', $arrids);
             } elseif (is_numeric($arrids)) {
                 $query->where('idfacultadestudio = ?', $arrids);
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
         }*/
    }
}

