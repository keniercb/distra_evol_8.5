<?php

class ConfEntidadFormatoNumContrato extends BaseConfEntidadFormatoNumContrato
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomFormatoNumContrato', array('local'   => 'idformatonumcontrato',
                                           'foreign' => 'idformatonumcontrato')
        );
        $this->hasMany(
            'ConfEntidadFormatoNumContratoIncremento',
            array('local'   => 'identidadformatonumcontrato',
                  'foreign' => 'identidadformatonumcontrato')
        );
    }

    public function getFormatoNumContrato($identidad)
    {
        $query = Doctrine_Query::create()
            ->from('ConfEntidadFormatoNumContrato')
            ->where('identidad =?', $identidad)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);

        return $query->execute();
    }

    public function getElementosIncrementales($idformato, $identiformat,
        $contratodestino
    ) {
        $query = Doctrine_Query::create()
            ->select('fe.*, fen.*, cei.*')
            ->from('NomFormatoNumContratoElemento fe')
            ->leftJoin('fe.NomFormatoNumContratoElementoNumerico fen')
            ->leftJoin('fen.ConfEntidadFormatoNumContratoIncremento cei WITH cei.identidadformatonumcontrato = ? and 
                      cei.identidadformatonumcontrato IN (SELECT cef.identidadformatonumcontrato 
                      FROM ConfEntidadFormatoNumContrato cef 
                      WHERE cei.identidadformatonumcontrato = ? AND cef.contratodestino = ?)',
                array($identiformat,$identiformat,$contratodestino)
            )
            ->where(
                '(fe.tipo = 3 or fe.tipo = 6 or fe.tipo = 7) and fe.idformatonumcontrato = ?', array($idformato)
            );
        //print_r(array($identiformat,$contratodestino,$idformato,$query->getSqlQuery()));die;
        return $query->fetchArray();
    }

    public static function insertarValores($values)
    {
        $model = new ConfEntidadFormatoNumContrato();
        $model->identidad = $values['identidad'];
        $model->idformatonumcontrato = $values['idformatonumcontrato'];
        $model->contratodestino = $values['contratodestino'];
        $model->save();

        return $model->identidadformatonumcontrato;
    }

    public static function modificarValores($idformatoent, $values)
    {
        $model = Doctrine::getTable('ConfEntidadFormatoNumContrato')->find(
            $idformatoent
        );
        $model->synchronizeWithArray($values);
        $model->save();
    }

    public static function getFormatoNumContratoData($identidad,$contratodestino)
    {
        $where = array("ce.identidad = ?");
        $params = array($identidad);
        if($contratodestino){
            $where[] = "ce.contratodestino = ?";
            $params[] = $contratodestino;
        }
        $query = Doctrine_Query::create()
            ->select(
                'ce.identidadformatonumcontrato, cei.*, f.*, fe.*, fef.*, fet.*, fen.*, fenom.*, fenomv.*, feparam.*'
            )
            ->from('ConfEntidadFormatoNumContrato ce')
            ->leftJoin('ce.ConfEntidadFormatoNumContratoIncremento cei')
            ->leftJoin('ce.NomFormatoNumContrato f')
            ->leftJoin('f.NomFormatoNumContratoElemento fe')
            ->leftJoin('fe.NomFormatoNumContratoElementoFecha fef')
            ->leftJoin('fe.NomFormatoNumContratoElementoTexto fet')
            ->leftJoin('fe.NomFormatoNumContratoElementoNumerico fen')
            ->leftJoin('fe.NomFormatoNumContratoElementoNomenclador fenom')
            ->leftJoin('fenom.NomFormatoNumContratoElementoNomencladorValor fenomv')
            ->leftJoin('fe.NomFormatoNumContratoElementoParametro feparam')
            ->where(implode(' AND ',$where), $params)
            ->orderBy('fe.orden');
        return $query->fetchOne(array(), Doctrine_Core::HYDRATE_ARRAY);
    }

    public static function delFormatoNumContrato($identidad)
    {
        $query = Doctrine_Query::create()
            ->delete()
            ->from('ConfEntidadFormatoNumContrato')
            ->where('identidad = ?', $identidad);
        $query->execute();
    }

    public static function getElementosIncrementalesByEntidad($ident)
    {
        return Doctrine_Query::create()
            ->select('ce.identidadformatonumcontrato, cei.*, f.idformatonumcontrato, fe.tipo, fen.*')
            ->from('ConfEntidadFormatoNumContrato ce')
            ->leftJoin('ce.ConfEntidadFormatoNumContratoIncremento cei indexBy idformatonumcontratoelemento')
            ->leftJoin('ce.NomFormatoNumContrato f')
            ->leftJoin('f.NomFormatoNumContratoElemento fe indexBy idformatonumcontratoelemento')
            ->leftJoin('fe.NomFormatoNumContratoElementoNumerico fen')

            ->where('ce.identidad = ? and fe.tipo in (3,6,7,8)', array($ident))
            ->fetchOne(array(), Doctrine_Core::HYDRATE_ARRAY);
    }
}