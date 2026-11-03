<?php

class NomTipocontactoModel extends ZendExt_Model
{

    //$_objtypecontact=> objeto
    protected $_objtypecontact = null;

    function __construct()
    {
        $this->_objtypecontact = new NomTipocontacto();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener tipo contacto activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return objectArray
     * @throws Exception
     */
    public function getActiveTypeContact($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objtypecontact->getActiveTypeContact($filtro, $limit, $start);
            $tmp->quantity = $this->_objtypecontact->getCantActiveTypeContact($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar un tipo medio contacto
     *
     * @param object $objtypecontact
     *
     * @return numeric
     */
    public function addTypeContact($denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!NomTipocontacto::findByIdOrDenomadd($denominacion)) {
                $tipoDocId = new NomTipocontacto();
                $tipoDocId->denominacion = $denominacion;
                $tipoDocId->abreviatura = $abreviatura;
                $tipoDocId->descripcion = $descripcion;
                $tipoDocId->fdesde = $fdesde;
                $tipoDocId->fhasta = $fhasta;
                $tipoDocId->save();

                return true;
            } else {
                return false;
            }

        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para modificar el tipo medio contacto
     *
     * @param numeric $idtipocontacto
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modTypeContact($idtipocontacto, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!NomTipocontacto::findByIdOrDenom($denominacion, $idtipocontacto)) {
                $objDomain = new NomTipocontacto();
                $result = $objDomain->modTypeContact($idtipocontacto, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta);
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
     * Funcion para elieminar el tipo medio contacto
     *
     * @param array $arrids
     *
     * @return type
     */
    public function delTypeContact($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipocontacto');
//            if (is_array($ids)) {
//                $query->whereIn('idtipocontacto', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idtipocontacto = ?', $arrids);
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
              $query->from('NomTipocontacto');
              if (is_array($ids)) {
                  $query->whereIn('idtipocontacto', $arrids);
              } elseif (is_numeric($arrids)) {
                  $query->where('idtipocontacto = ?', $arrids);
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

