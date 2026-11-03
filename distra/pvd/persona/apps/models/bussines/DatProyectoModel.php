<?php

class DatProyectoModel extends ZendExt_Model
{
    protected $_objDatProyecto;

    function __construct()
    {
        $this->_objDatProyecto = new DatProyecto();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatProyecto $proyecto)
    {
        $proyecto->save();

        return $proyecto->idproyecto;
    }

    public function Eliminar($idproyecto)
    {
        try {
            $proyecto = Doctrine::getTable('DatProyecto')->find($idproyecto);
            if ($proyecto != false) {
                $proyecto->delete();

                return true;
            }
        } catch (Doctrine_Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    /**
     * Funcion para obtener todos los proyectos
     *
     * @param $limit
     * @param $start
     * @param $query
     *
     * @return array
     * @throws Exception
     */
    public function getAllProjects($limit, $start, $query)
    {
        try {
            return array(
                'datos' => $this->_objDatProyecto->getPorLimite($limit, $start, $query),
                'cantidad' => $this->_objDatProyecto->getCantListTodos($query),);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idProject
     *
     * @return array
     * @throws Exception
     */
    public function getConfigProject($idProject)
    {
        try {
            return $this->_objDatProyecto->getConfigProject($idProject);
        } catch (Exception $e) {
            throw $e;
        }
    }

}

