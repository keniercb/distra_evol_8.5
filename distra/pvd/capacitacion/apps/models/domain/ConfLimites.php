<?php
class ConfLimites extends BaseConfLimites
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idlimite)
    {
        return Doctrine::getTable('ConfLimites')->find($idlimite);
    }

    /**
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getLimites()
    {
        try {
            $select
                = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('ConfLimites dd')
                ->orderBy('dd.idlimite');
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}