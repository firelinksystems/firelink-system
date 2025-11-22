import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobForm } from '../entities/job-form.entity';
import { FormTemplate } from '../entities/form-template.entity';
import { SubmitFormDto } from './dto/submit-form.dto';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(JobForm)
    private jobFormsRepository: Repository<JobForm>,
    @InjectRepository(FormTemplate)
    private formTemplatesRepository: Repository<FormTemplate>,
  ) {}

  async submitForm(submitFormDto: SubmitFormDto, userId: string): Promise<JobForm> {
    const { job_id, form_template_id, form_data } = submitFormDto;

    // Verify form template exists
    const formTemplate = await this.formTemplatesRepository.findOne({
      where: { id: form_template_id },
    });

    if (!formTemplate) {
      throw new NotFoundException('Form template not found');
    }

    // Create job form submission
    const jobForm = this.jobFormsRepository.create({
      job_id,
      form_template_id,
      form_data,
      submitted_by: { id: userId },
    });

    return await this.jobFormsRepository.save(jobForm);
  }

  async getFormSubmissions(jobId: string): Promise<JobForm[]> {
    return await this.jobFormsRepository.find({
      where: { job_id: jobId },
      relations: ['form_template', 'submitted_by'],
      order: { submitted_at: 'DESC' },
    });
  }

  async getFormTemplates(complianceStandard?: string): Promise<FormTemplate[]> {
    const where: any = { is_active: true };
    
    if (complianceStandard) {
      where.compliance_standard = complianceStandard;
    }

    return await this.formTemplatesRepository.find({ where });
  }

  async getFormTemplate(id: string): Promise<FormTemplate> {
    const template = await this.formTemplatesRepository.findOne({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Form template not found');
    }

    return template;
  }

  async createFormTemplate(createTemplateDto: any): Promise<FormTemplate> {
    const template = this.formTemplatesRepository.create(createTemplateDto);
    return await this.formTemplatesRepository.save(template);
  }
}
