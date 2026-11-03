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

class NomNivelorganizacionModel extends ZendExt_Model
{

    protected $_objLevelInOrganization = null;

    function __construct()
    {
        $this->_objLevelInOrganization = new NomNivelorganizacion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener los nivel organizacion activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return abjectArray
     * @throws Exception
     */
    public function getLevelInOrganizationActive($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objLevelInOrganization->getLevelInOrganizationActive($filtro, $limit, $start);
            $tmp->quantity = $this->_objLevelInOrganization->getCantLevelInOrganizationActive($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar nivel organizacion
     *
     * @param object $objskincolor
     *
     * @return numeric
     */
    public function addLevelInOrganization($objLevelInOrganization)
    {
        try {
            $objDomain = new NomNivelorganizacion();
            if (!$objDomain->findByIdOrDenomadd($objLevelInOrganization->denominacion)) {
                $obj = new NomNivelorganizacion();
                foreach ($objLevelInOrganization as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idnivelorganizacion;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para maodificar nivel organizacion
     *
     * @param numeric $idnivelorganizacion
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modLevelInOrganization($idnivelorganizacion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!NomNivelorganizacion::findByIdOrDenom($denominacion, $idnivelorganizacion)) {
                $objDomain = new NomNivelorganizacion();
                $result = $objDomain->modLevelInOrganization(
                    $idnivelorganizacion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta
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
     * Funcion para eliminar nivel organizacion
     *
     * @param array $arrids
     *
     * @return value
     */
    public function delLevelInOrganization($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomNivelorganizacion');
//            if (is_array($ids)) {
//                $query->whereIn('idnivelorganizacion', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idnivelorganizacion = ?', $arrids);
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
              $query->from('NomNivelorganizacion');
              if (is_array($ids)) {
                  $query->whereIn('idnivelorganizacion', $arrids);
              } elseif (is_numeric($arrids)) {
                  $query->where('idnivelorganizacion = ?', $arrids);
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

