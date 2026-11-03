<?php
class DatExtensionprep extends BaseDatExtensionprep
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idextensionprep)
    {
        return Doctrine::getTable('DatExtensionprep')->find($idextensionprep);
    }

    /**
     * @param int $idreciengraduado
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getExtensiones($idreciengraduado)
    {
        try {
            $select
                = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatExtensionprep dd')
                ->where("dd.idreciengraduado = '$idreciengraduado'");
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}