<?php

class DatCampo extends BaseDatCampo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatTabla', array('local' => 'idtabla', 'foreign' => 'idtabla'));
        $this->hasOne('NomTipoDatoNomGestor', array('local' => 'idtipodatogestor', 'foreign' => 'idtipodatogestor'));
        $this->hasOne('DatDisplayfield', array('local' => 'idcampo', 'foreign' => 'idcampo'));
        $this->hasOne('DatComponente', array('local' => 'idcampo', 'foreign' => 'idcampo'));
        $this->hasMany('DatRelacion as Origen', array('local' => 'idcampo', 'foreign' => 'campoorigen'));
        $this->hasMany('DatRelacion as Destino', array('local' => 'idcampo', 'foreign' => 'campodestino'));
    }

    public function cargarCampos($idtabla)
    {
        $q = Doctrine_Query::create();
        return $q->select(
            'c.idcampo,c.denominacion,c.longitud,c.permitenulo,c.llaveprimaria,c.idtabla,tdg.*,td.*,comp.*'
        )->from('DatCampo c')->innerJoin('c.NomTipoDatoNomGestor tdg')->innerJoin('tdg.NomTipoDato td')->leftJoin(
                'c.DatComponente comp'
            )->where('c.idtabla = ?', $idtabla)->addOrderBy('comp.orden')->execute()->toArray(true);
    }

    public static function existeCampo($idtabla, $campo)
    {
        $q = Doctrine_Query :: create();
        return $q->select('COUNT(c.idcampo) as total')
            ->from('DatCampo c')
            ->where('c.idtabla = ? AND c.denominacion = ?', array($idtabla, $campo))
            ->setHydrationMode(Doctrine :: HYDRATE_RECORD)
            ->execute()
            ->getFirst()
            ->total;
    }

    public function obtenerCampoPorDenominacion($idtabla, $campo)
    {
        $q = Doctrine_Query :: create();
        return $q->select('c.idcampo')
            ->from('DatCampo c')
            ->where('c.idtabla = ? AND c.denominacion = ?', array($idtabla, $campo))
            ->setHydrationMode(Doctrine :: HYDRATE_RECORD)
            ->execute()
            ->getFirst();
    }

    public function obtenerCamposConRepresentacion($idtabla, $allmeta = false)
    {
        $q = Doctrine_Query :: create();
        $data = $q->from('DatCampo f')
            ->innerJoin('f.DatComponente cp')
            ->innerJoin('f.NomTipoDatoNomGestor tdg')
            ->innerJoin('tdg.NomTipoDato td');
        if ($allmeta) {
            $data->leftJoin('cp.DatCampoNumerico cn')
                ->leftJoin('cp.DatCampoTexto ct')
                ->leftJoin('cp.DatChequeo dc')
                ->leftJoin('cp.DatFecha df')
                ->select(
                    'cn.limiteinferior, cn.limitesuperior, cn.decimal, cn.precision, ct.idexpresionregular,
                    dc.valor, df.fechainicio, df.fechafin'
                );
        }
        return $data->select(
            'f.idcampo, f.denominacion, f.longitud, cp.etiqueta, tdg.idtipodatogestor, td.denominacion,
            cp.idtipocomponente,cp.orden'
        ) //, cp.etiqueta, tdg.idtipodatogestor, td.denominacion, cp.idtipocomponente,cp.orden
            ->where('f.idtabla = ?', $idtabla)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public static function obtenerLLavePrimaria($idtabla)
    {
        $q = Doctrine_Query :: create();
        return $q->from('DatCampo c')
            ->where('c.idtabla = ? AND c.llaveprimaria = 1', $idtabla)
            ->setHydrationMode(Doctrine :: HYDRATE_RECORD)
            ->execute()
            ->getFirst();
    }

    public function obtenerDisplayField($idtabla)
    {
        $q = Doctrine_Query :: create();
        return $q->from('DatCampo c')
            ->innerJoin('c.DatDisplayfield df')
            ->where('df.idtabla = ?', $idtabla)
            ->setHydrationMode(Doctrine :: HYDRATE_RECORD)
            ->execute()
            ->getFirst();
    }

    public function getTipoDatoGestor($tipodato, $gestor)
    {
        $sqlMetadataManager = new ZendExt_Metadata_Sql_Manager();
        $q = Doctrine_Query :: create($sqlMetadataManager->getConnection());
        return $q->from('NomTipoDatoNomGestor tdg')->innerJoin('tdg.NomGestor ng')->where(
            'ng.denominacion = ? AND tdg.idtipodato = ?', array($gestor, $tipodato)
        )->setHydrationMode(Doctrine :: HYDRATE_RECORD)->execute()->getFirst()->idtipodatogestor;
    }

    public static function cargarCmbCampos($tabla)
    {
        $q = Doctrine_Query :: create();
        return $q->from('DatCampo f')
            ->leftJoin('f.DatComponente cp')
            //->innerJoin('cp.NomTipoComponente ct')
            ->select('f.idcampo, f.denominacion, f.longitud, cp.etiqueta, ct.tabla, f.llaveprimaria')
            ->where('f.idtabla = ?', $tabla)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public static function obtenerUltimoOrden($idtabla)
    {
        $q = Doctrine_Query :: create();
        return $q->select('COUNT(c.idcomponente)+1 as total')
            ->from('DatComponente c')
            ->innerJoin('c.DatCampo f')
            ->innerJoin('f.DatTabla t')
            ->where('t.idtabla = ? ', $idtabla)
            ->setHydrationMode(Doctrine :: HYDRATE_RECORD)
            ->execute()
            ->getFirst()
            ->total;
    }

}
