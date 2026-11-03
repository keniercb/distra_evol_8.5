<?php

/**
 * Class SegAccesosindominioModel
 */
class SegAccesosindominioModel extends ZendExt_Model
{
    /**
     * @var SegAccesosindominio
     */
    protected $_objAccesoSinDominio;

    /**
     *
     */
    function __construct()
    {
        $this->_objAccesoSinDominio = new SegAccesosindominio();
    }

    /**
     *
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param array $idpersona
     * @param       $idusuario
     *
     * @throws Exception
     */
    public function addAccesoSinDominio(array $idpersona, $idusuario)
    {
        try {
            if (count($idpersona) > 0) {
                $idusuario = empty($idusuario) ? $this->getUsuarioLogged() : $idusuario;
                $collection = new Doctrine_Collection('SegAccesosindominio');
                foreach ($idpersona as $v) {
                    $p = count($collection);
                    $collection[$p]->idpersona = $v;
                    $collection[$p]->idusuario = $idusuario;
                }
                $collection->save();
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    protected function getUsuarioLogged()
    {
        return $this->global->Perfil->idusuario;
    }

    /**
     * @param array $idpersona
     * @param       $idusuario
     *
     * @throws Exception
     */
    public function delAccesoSinDominio(array $idpersona, $idusuario = null)
    {
        try {
            if (count($idpersona) > 0) {
                $idusuario = empty($idusuario) ? $this->getUsuarioLogged() : $idusuario;
                $this->_objAccesoSinDominio->delAccesoSinDominio($idpersona, $idusuario);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }
}

