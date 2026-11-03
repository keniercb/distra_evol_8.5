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

class NomEstratificacionsocialModel extends ZendExt_Model
{
    protected $_objSocialStratification = null;

    function __construct()
    {
        $this->_objSocialStratification = new NomEstratificacionsocial();
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
    public function getSocialStratificationActive($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objSocialStratification->getSocialStratificationActive($filtro, $limit, $start);
            $tmp->quantity = $this->_objSocialStratification->getCantSocialStratificationActive($filtro);

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
    public function addSocialStratification($objSocialStratification)
    {
        try {
            $objDomain = new NomEstratificacionsocial();
            if (!$objDomain->findByIdOrDenomadd($objSocialStratification->denominacion)) {
                $obj = new NomEstratificacionsocial();
                foreach ($objSocialStratification as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idestratificacionsocial;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para maodificar color de piel
     *
     * @param numeric $idestratificacionsocial
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modSocialStratification($idestratificacionsocial, $denominacion, $abreviatura, $descripcion, $fdesde,
        $fhasta)
    {
        try {
            if (!NomEstratificacionsocial::findByIdOrDenom($denominacion, $idestratificacionsocial)) {
                $objDomain = new NomEstratificacionsocial();
                $result = $objDomain->modSocialStratification(
                    $idestratificacionsocial, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta
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
    public function delSocialStratification($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomEstratificacionsocial');
//            if (is_array($ids)) {
//                $query->whereIn('idestratificacionsocial', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idestratificacionsocial = ?', $arrids);
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
        /*  try {
              $query = Doctrine_Query::create();
              $query->from('NomEstratificacionsocial');
              if (is_array($ids)) {
                  $query->whereIn('idestratificacionsocial', $arrids);
              } elseif (is_numeric($arrids)) {
                  $query->where('idestratificacionsocial = ?', $arrids);
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

