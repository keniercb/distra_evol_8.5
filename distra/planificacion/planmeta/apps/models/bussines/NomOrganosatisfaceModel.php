<?php

class NomOrganosatisfaceModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertarnom_organosatisface(NomOrganosatisface $nomOrganosatisface
    )
    {
        $nomOrganosatisface->save();
        return $nomOrganosatisface->idorganosatisface;
    }

    public function modificarnom_organosatisface($nomOrganosatisface)
    {
        $nomOrganosatisface->save();
    }

    public function eliminarnom_organosatisface($nomOrganosatisface)
    {
        $nomOrganosatisface->delete();
    }

    public function eliminarOrganosatisface($id, $rolledback)
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $query = Doctrine_Query::create();
        try {
            $query->delete()->from('NomOrganosatisface')->where(
                'idorganosatisface = ?', array($id)
            )
                ->execute();
            if (!$rolledback) {
                $conn->commit();
            }
            $conn->beginTransaction();
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == '23503') {
                $conn->rollback();
                return false;
            }
        }
        return true;
    }

    public function eliminarOrganosatisfaces($idorganosatisface)
    {
        $query = Doctrine_Query::create();
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();

        try {
            $query->delete('NomOrganosatisface')
                ->from('NomOrganosatisface')
                ->addWhere('idorganosatisface = ?', $idorganosatisface);
            $query->execute();
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == '23503') {
                $conn->rollback();
                return 3;
            }
        }
        return 1;
    }

    public function listarOACE()
    {
        return NomOrganosatisface::ObtenerDatosNomenclador();
    }

    public function listarOrganoSatisfaceSustitucionImp($limit=false)
    {
        return NomOrganosatisface::ObtenerOrganoSatisfaceSustitucionImp($limit);
    }

    public function listarOrganosSatisfacenPorViaAdquisicion($parametros)
    {
        return NomOrganosatisface::listarOrganosSatisfacenPorViaAdquisicion(
            $parametros
        );
    }

    public function listarOrgSat()
    {
        $data->data = NomOrganosatisface::obtenerOS();
        return $data;
    }

}
