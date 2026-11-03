<?php

class NomCampoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(NomCampo $NomCampo)
    {
        $NomCampo->save();
    }

    public function Actualizar(NomCampo $NomCampo)
    {
        $NomCampo->save();
    }

    public function Eliminar($idcampo)
    {
        try {
            $r->cantRowAfected = Doctrine_Query::create()->delete()->from('NomCampo')->where('idcampo = ?', $idcampo)
                ->execute();

            return $r;
        } catch (Exception $e) {
            if ($e->getCode() == 23503) {//Code for foreignKeyViolation
                $r->exception = 1;

                return $r;
            } else {
                return (json_encode($e->getMessage()));
            }
        }
    }

}

