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

class NomFormaadquiriridiomaModel extends ZendExt_Model
{

    protected $_objWayAcquiringLanguage = null;

    function __construct()
    {
        $this->_objWayAcquiringLanguage = new NomFormaadquiriridioma();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener los militancia activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return abjectArray
     * @throws Exception
     */
    public function getWayAcquiringLanguageActive($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objWayAcquiringLanguage->getWayAcquiringLanguageActive($filtro, $limit, $start);
            $tmp->quantity = $this->_objWayAcquiringLanguage->getCantWayAcquiringLanguageActive($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar Social stratification
     *
     * @param object $objskincolor
     *
     * @return numeric
     */
    public function addWayAcquiringLanguage($objWayAcquiringLanguage)
    {
        try {
            $objDomain = new NomFormaadquiriridioma();
            if (!$objDomain->findByIdOrDenomadd($objWayAcquiringLanguage->denominacion)) {
                $obj = new NomFormaadquiriridioma();
                foreach ($objWayAcquiringLanguage as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idformaadquiriridioma;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para maodificar condecoracion
     *
     * @param numeric $idformaadquiriridioma
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modWayAcquiringLanguage($idformaadquiriridioma, $denominacion, $abr, $descripcion, $fdesde,
        $fhasta)
    {
        try {
            if (!NomFormaadquiriridioma::findByIdOrDenom($denominacion, $idformaadquiriridioma)) {
                $objDomain = new NomFormaadquiriridioma();
                $result = $objDomain->modWayAcquiringLanguage(
                    $idformaadquiriridioma, $denominacion, $abr, $descripcion, $fdesde, $fhasta
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
     * Funcion para eliminar Social stratification
     *
     * @param array $arrids
     *
     * @return value
     */
    public function delWayAcquiringLanguage($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomFormaadquiriridioma');
//            if (is_array($ids)) {
//                $query->whereIn('idformaadquiriridioma', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idformaadquiriridioma = ?', $arrids);
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
             $query->from('NomFormaadquiriridioma');
             if (is_array($ids)) {
                 $query->whereIn('idformaadquiriridioma', $arrids);
             } elseif (is_numeric($arrids)) {
                 $query->where('idformaadquiriridioma = ?', $arrids);
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

