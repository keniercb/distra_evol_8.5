<?php

class NomJefefacultadoModel extends ZendExt_Model
{

    protected $objFormEnteringFar = null;

    function __construct()
    {
        $this->objFormEnteringFar = new NomJefefacultado();
        $this->objEstructuraService = new EyCServices();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return abjectArray
     * @throws Exception
     */
    public function getFormEnteringFarActive($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->objFormEnteringFar->getFormEnteringFarActive($filtro, $limit, $start);
//print_r($tmp->data);die;
            foreach ($tmp->data as $c => $array) {
                $cargo = $this->objEstructuraService->getAllCargos($array['idcargopropuesto'], null, null);
                $tmp->data[$c]['cargopropuesto'] = $cargo[0]['denominacion'];
            }

            $tmp->quantity = $this->objFormEnteringFar->getCantFormEnteringFarActive($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar via de ingreso far
     *
     * @param object $objFormEnteringFar
     *
     * @return numeric
     */
    public function addFormEnteringJefe($objFormEnteringJefe)
    {
        try {

            $objDomain = new NomJefefacultado();
           if (!$objDomain->findByIdOrDenom($objFormEnteringJefe->idcargopropuesto)) {
                $obj = new NomJefefacultado();
                foreach ($objFormEnteringJefe as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idjefesfacultado;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para maodificar via de ingreso far
     *
     * @param numeric $idcolorpiel
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modFormEnteringJefe($idjefesfacultado, $idcargopropuesto, $abreviatura,$descripcion, $fdesde, $fhasta)
    {
        try {
            $objDomain = new NomJefefacultado();
            $result = $objDomain->modFormEnteringFar(
                $idjefesfacultado, $idcargopropuesto, $abreviatura, $descripcion, $fdesde, $fhasta
            );

            return $result;
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    /**
     * Funcion para eliminar via de ingreso far
     *
     * @param array $arrids
     *
     * @return value
     */
    public function delFormEnteringJefe($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomJefefacultado');
            if (is_array($ids)) {
                $query->whereIn('idjefesfacultado', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idjefesfacultado = ?', $arrids);
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

