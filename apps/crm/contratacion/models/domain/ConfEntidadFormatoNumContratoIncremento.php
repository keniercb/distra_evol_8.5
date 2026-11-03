<?php

class ConfEntidadFormatoNumContratoIncremento extends BaseConfEntidadFormatoNumContratoIncremento
{
    public function setUp()
    {
        parent::setUp();
		$this->hasOne('ConfEntidadFormatoNumContrato', array('local' => 'identidadformatonumcontrato', 'foreign' => 'identidadformatonumcontrato'));
		$this->hasOne('NomFormatoNumContratoElementoNumerico', array('local' => 'idformatonumcontratoelemento', 'foreign' => 'idformatonumcontratoelemento'));
    }

    public static function getElementosIncrementalesByEntidad1($ident,$contratodestino)
    {
        $where = array('ce.identidad = ?');
        $parametros = array($ident);
        if($contratodestino){
            $where[] = 'ce.contratodestino = ?';
            $parametros[] = $contratodestino;
        }
        return Doctrine_Query::create()
            ->select('cei.*')
            ->from('ConfEntidadFormatoNumContratoIncremento cei')
            ->leftJoin('cei.ConfEntidadFormatoNumContrato ce')
            ->where(implode(' AND ',$where), $parametros)
            ->fetchArray();
    }

    public static function getElementosIncrementalesByEntidad($ident,$contratodestino)
    {
        return Doctrine_Query::create()
            ->select('ce.identidadformatonumcontrato, cei.*, f.idformatonumcontrato, fe.tipo, fen.*')
            ->from('ConfEntidadFormatoNumContrato ce')
            ->leftJoin('ce.ConfEntidadFormatoNumContratoIncremento cei indexBy idformatonumcontratoelemento')
            ->leftJoin('ce.NomFormatoNumContrato f')
            ->leftJoin('f.NomFormatoNumContratoElemento fe indexBy idformatonumcontratoelemento')
            ->leftJoin('fe.NomFormatoNumContratoElementoNumerico fen')

            ->where('ce.identidad = ? and ce.contratodestino=? and fe.tipo in (3,6,7,8)', array($ident, $contratodestino))
            ->fetchOne(array(), Doctrine_Core::HYDRATE_ARRAY);
    }

    public static function eliminarElementosIncrementalesEntidad($idformatoent)
    {
        Doctrine_Query::create()
            ->delete('ConfEntidadFormatoNumContratoIncremento')
            ->where('identidadformatonumcontrato =?', $idformatoent)
            ->execute();
    }

    public static function insertarValores($values)
    {
        $model = new ConfEntidadFormatoNumContratoIncremento();
        $model->fromArray($values);
        $model->save();
    }

    public static function modificarValores($idpk, $values)
    {
        $model = Doctrine::getTable('ConfEntidadFormatoNumContratoIncremento')->find($idpk);
        $model->synchronizeWithArray($values);
        $model->save();
    }

    public static function incrementarValor($idelem)
    {
        Doctrine_Query::create()
            ->update('ConfEntidadFormatoNumContratoIncremento')
            ->set('valor', 'valor + 1')
            ->where('identidadformatonumcontratoincremento = ?', $idelem)
            ->execute();
    }
}