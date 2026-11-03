<?php

/**
 *
 */
class RegNumericoService
{

    private $mMovRegNumerico;
    private $mRegNumerico;

    public function __construct()
    {
        $this->mMovRegNumerico = new MovRegNumericoModel();
        $this->mRegNumerico = new RegNumericoModel();
    }

    /**
     * Devuelve una instancia de la clase
     *
     * @return RegNumericoModel
     */
    public function getObjRegNumericoModel()
    {
        return $this->mRegNumerico;
    }

    /**
     * @param $idDocumento
     *
     * @return mixed
     */
    public function getCantRegNumDadoIdDocumento($idDocumento)
    {
        return $this->mMovRegNumerico->getCantidadMovRegNumPorDocumento($idDocumento);
    }

    /**
     * @param $idDocumento
     *
     * @return array
     */
    public function getIdesRegNumByIdDocumento($idDocumento)
    {
        return $this->mMovRegNumerico->getIdesRegNumByIdDocumento($idDocumento);
    }

    /**
     * @param $idDocumento
     *
     * @return mixed
     */
    public function getMovDadoDocumento($idDocumento)
    {
        //$movRegNum = new RegNumericoModel();
        return $this->mMovRegNumerico->getMovDadoDocumento($idDocumento);
    }

    /**
     * @param $idRegNumerico
     *
     * @return mixed
     */
    public function getUltimoIdMovRegNumerico($idRegNumerico)
    {
        //return $this->mMovRegNumerico->getUltimoIdMovRegNumerico($idRegNumerico);
        // -- Este metodo de un dia para otro ya no estaba.
        return $this->mMovRegNumerico->getIdMovRegNumericoActivo($idRegNumerico);
    }

    /**
     * Permite conocer si una persona tiene medios asignados
     * @param $idpersona
     * @return bool
     */
    public function existePersonaConMedios($arrIdPersonas){
        $sql = "SELECT resp.idpersona, resp.idresponsable
                FROM mod_logactivofijotangible.dat_responsable resp
                WHERE resp.idpersona in (" . implode(',', $arrIdPersonas) . ")";
        $conn = Zend_Registry::get('conexion');
        $responsable = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        if(count($responsable) > 0)
            return true;
        return false;
    }
}
