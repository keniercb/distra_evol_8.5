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

class NomMotivocondecoracionModel extends ZendExt_Model
{

    protected $_objMotiveOfDecoration = null;

    function __construct()
    {
        $this->_objMotiveOfDecoration = new NomMotivocondecoracion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener los sancion activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return abjectArray
     * @throws Exception
     */
    public function getMotiveOfDecorationActive($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objMotiveOfDecoration->getMotiveOfDecorationActive($filtro, $limit, $start);
            $tmp->quantity = $this->_objMotiveOfDecoration->getCantMotiveOfDecorationActive($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar sancion
     *
     * @param object $objMotiveOfDecoration
     *
     * @return numeric
     */
    public function addMotiveOfDecoration($objMotiveOfDecoration)
    {
        try {
            $objDomain = new NomMotivocondecoracion();
            if (!$objDomain->findByIdOrDenomadd($objMotiveOfDecoration->denominacion)) {
                $obj = new NomMotivocondecoracion();
                foreach ($objMotiveOfDecoration as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idmotivocondecoracion;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para maodificar sancion
     *
     * @param numeric $idmotivocondecoracion
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modMotiveOfDecoration($idmotivocondecoracion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!NomMotivocondecoracion::findByIdOrDenom($denominacion, $idmotivocondecoracion)) {
                $objDomain = new NomMotivocondecoracion();
                $result = $objDomain->modMotiveOfDecoration(
                    $idmotivocondecoracion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta
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
     * Funcion para eliminar sancion
     *
     * @param array $arrids
     *
     * @return value
     */
    public function delMotiveOfDecoration($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomMotivocondecoracion');
//            if (is_array($ids)) {
//                $query->whereIn('idmotivocondecoracion', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idmotivocondecoracion = ?', $arrids);
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
              $query->from('NomMotivocondecoracion');
              if (is_array($ids)) {
                  $query->whereIn('idmotivocondecoracion', $arrids);
              } elseif (is_numeric($arrids)) {
                  $query->where('idmotivocondecoracion = ?', $arrids);
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

