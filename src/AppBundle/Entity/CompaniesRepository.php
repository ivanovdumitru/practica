<?php

namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\QueryBuilder;

/**

 */
class CompaniesRepository extends \Doctrine\ORM\EntityRepository
{
   public function showAction()
    {
        /* $db = $this->createQueryBuilder('Companies');
         $query = $db->getQuery();
         return $query->execute();   
        $qb="Select * From AppBundle:Companies";
        $query= $this->getEntityManager()->createQuery($qb);
        return $query->execute();*/
        $db = $this->createQueryBuilder('Companies');
        $query = $db->getQuery();
        return $query->execute();
    }
}
